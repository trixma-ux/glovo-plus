import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module';
async function bootstrap(){ const app=await NestFactory.create(AppModule); const config=app.get(ConfigService); const port=config.get<number>('PORT')||3000; app.use(helmet()); app.use(morgan('combined')); app.enableCors({origin:'*'}); const swagger=new DocumentBuilder().setTitle('Smart Delivery API Gateway').setDescription('Point d’entrée central').setVersion('1.0.0').addBearerAuth().build(); const doc=SwaggerModule.createDocument(app,swagger); SwaggerModule.setup('api/docs',app,doc); await app.listen(port,'0.0.0.0'); console.log(`API Gateway running on port ${port}`); } bootstrap();
