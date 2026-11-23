import { All, Controller, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request, Response } from 'express';
import { isEdgeUnavailable, markTraffic } from '../common/upstreams';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Controller('api')
export class ProxyController { constructor(private readonly config:ConfigService){}
  @All('*') async proxy(@Req() req:Request,@Res() res:Response){
    markTraffic();
    const original=req.path.replace('/api','') || '/'; const target=this.resolve(original);
    if(!target) return res.status(404).json({message:'Route inconnue dans API Gateway'});
    if(!target.baseUrl) return res.status(503).json({message:'Service non déployé dans cette démo', path:original});
    // Service amont en veille (edge Render) : on rejoue pendant WAKE_RETRY_MS (défaut 20 s), la requête n'ayant pas atteint l'app
    const deadline=Date.now()+Number(process.env.WAKE_RETRY_MS||20000);
    for(let attempt=1;;attempt++){
      try{
        const response=await axios({method:req.method as any, url:`${target.baseUrl}${target.path}`, data:req.body, params:req.query, headers:{authorization:req.headers.authorization,'content-type':req.headers['content-type']}, timeout:Number(process.env.PROXY_TIMEOUT_MS||60000)});
        return res.status(response.status).json(response.data);
      }catch(error:any){
        const status=error.response?.status;
        if(isEdgeUnavailable(status, error.response?.headers)){
          if(Date.now()+3000<deadline){ await sleep(3000); continue; }
          console.warn(`[proxy] ${req.method} ${original} -> service amont indisponible (edge Render ${status}) après ${attempt} tentative(s)`);
          res.setHeader('Retry-After','5');
          return res.status(503).json({message:'Le service démarre (veille Render gratuite). Réessayez dans quelques secondes.', waking:true, path:original});
        }
        return res.status(status || 503).json({message:'Erreur API Gateway', detail:error.response?.data || error.message});
      }
    }
  }
  private resolve(path:string):{baseUrl:string; path:string}|null{ if(path.startsWith('/users') || path.startsWith('/auth')) return {baseUrl:this.config.get<string>('USER_SERVICE_URL')!, path}; if(path.startsWith('/restaurants') || path.startsWith('/products')) return {baseUrl:this.config.get<string>('RESTAURANT_SERVICE_URL')!, path}; if(path.startsWith('/orders')) return {baseUrl:this.config.get<string>('ORDER_SERVICE_URL')!, path}; if(path.startsWith('/deliveries')) return {baseUrl:this.config.get<string>('DELIVERY_SERVICE_URL')!, path}; if(path.startsWith('/ml')) return {baseUrl:this.config.get<string>('ML_SERVICE_URL')!, path:path.replace(/^\/ml/,'') || '/'}; return null; }
}
