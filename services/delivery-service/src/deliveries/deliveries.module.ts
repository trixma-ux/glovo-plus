import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { OrderClient } from '../clients/order.client';
import { MlClient } from '../clients/ml.client';
@Module({controllers:[DeliveriesController], providers:[DeliveriesService,OrderClient,MlClient]}) export class DeliveriesModule{}
