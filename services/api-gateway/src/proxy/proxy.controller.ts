import { All, Controller, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request, Response } from 'express';
@Controller('api')
export class ProxyController { constructor(private readonly config:ConfigService){}
  @All('*') async proxy(@Req() req:Request,@Res() res:Response){ const original=req.path.replace('/api','') || '/'; const target=this.resolve(original); if(!target) return res.status(404).json({message:'Route inconnue dans API Gateway'}); try{ const response=await axios({method:req.method as any, url:`${target.baseUrl}${target.path}`, data:req.body, params:req.query, headers:{authorization:req.headers.authorization,'content-type':req.headers['content-type']}, timeout:5000}); return res.status(response.status).json(response.data);}catch(error:any){ return res.status(error.response?.status || 503).json({message:'Erreur API Gateway', detail:error.response?.data || error.message}); }}
  private resolve(path:string):{baseUrl:string; path:string}|null{ if(path.startsWith('/users') || path.startsWith('/auth')) return {baseUrl:this.config.get<string>('USER_SERVICE_URL')!, path}; if(path.startsWith('/restaurants') || path.startsWith('/products')) return {baseUrl:this.config.get<string>('RESTAURANT_SERVICE_URL')!, path}; if(path.startsWith('/orders')) return {baseUrl:this.config.get<string>('ORDER_SERVICE_URL')!, path}; if(path.startsWith('/deliveries')) return {baseUrl:this.config.get<string>('DELIVERY_SERVICE_URL')!, path}; if(path.startsWith('/ml')) return {baseUrl:this.config.get<string>('ML_SERVICE_URL')!, path:path.replace(/^\/ml/,'') || '/'}; return null; }
}
