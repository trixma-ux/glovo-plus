import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module';
// CORS : origines autorisées via CORS_ORIGIN (liste séparée par des virgules), défaut GitHub Pages + dev local
const corsOrigins=(process.env.CORS_ORIGIN||'https://trixma-ux.github.io,http://localhost:5173').split(',').map(o=>o.trim().replace(/\/+$/,'')).filter(Boolean);
async function bootstrap(){ const app=await NestFactory.create(AppModule); const config=app.get(ConfigService); const port=config.get<number>('PORT')||3000; app.use(helmet()); app.use(morgan('combined')); app.enableCors({origin: corsOrigins.includes('*') ? '*' : corsOrigins, methods:'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', allowedHeaders:'Content-Type,Authorization'}); app.getHttpAdapter().get('/health',(_req:any,res:any)=>res.json({status:'ok',service:'api-gateway'})); const swagger=new DocumentBuilder().setTitle('Smart Delivery API Gateway').setDescription('Point d’entrée central').setVersion('1.0.0').addBearerAuth().build(); const doc=SwaggerModule.createDocument(app,swagger); SwaggerModule.setup('api/docs',app,doc); await app.listen(port,'0.0.0.0'); console.log(`API Gateway running on port ${port}`); } bootstrap();
