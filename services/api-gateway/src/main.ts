import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { startKeepWarm, upstreams } from './common/upstreams';
// CORS : origines autorisées via CORS_ORIGIN (liste séparée par des virgules), défaut GitHub Pages + dev local
const corsOrigins=(process.env.CORS_ORIGIN||'https://trixma-ux.github.io,http://localhost:5173').split(',').map(o=>o.trim().replace(/\/+$/,'')).filter(Boolean);
async function bootstrap(){
  const app=await NestFactory.create<NestExpressApplication>(AppModule);
  // Derrière le proxy Render (1 saut) : req.ip = IP client issue de X-Forwarded-For
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS||1));
  const config=app.get(ConfigService); const port=config.get<number>('PORT')||3000;
  app.use(helmet()); app.use(morgan('combined'));
  app.enableCors({origin: corsOrigins.includes('*') ? '*' : corsOrigins, methods:'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', allowedHeaders:'Content-Type,Authorization', exposedHeaders:'Retry-After'});
  const http=app.getHttpAdapter();
  http.get('/health',(_req:any,res:any)=>res.json({status:'ok',service:'api-gateway'}));
  // URL publiques des services amont : le front les pinge depuis le navigateur pour les réveiller
  http.get('/warmup',(_req:any,res:any)=>res.json({upstreams:upstreams().map(u=>({name:u.name, health:`${u.url}/health`}))}));
  const swagger=new DocumentBuilder().setTitle('Smart Delivery API Gateway').setDescription('Point d’entrée central').setVersion('1.0.0').addBearerAuth().build(); const doc=SwaggerModule.createDocument(app,swagger); SwaggerModule.setup('api/docs',app,doc);
  await app.listen(port,'0.0.0.0'); console.log(`API Gateway running on port ${port}`);
  startKeepWarm((url)=>axios.get(url,{timeout:10000}));
}
bootstrap();
