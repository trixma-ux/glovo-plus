import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
@Module({imports:[ConfigModule.forRoot({isGlobal:true}),PrismaModule,DeliveriesModule]}) export class AppModule{}
