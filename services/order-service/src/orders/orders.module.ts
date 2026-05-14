import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UserClient } from '../clients/user.client';
import { RestaurantClient } from '../clients/restaurant.client';
@Module({controllers:[OrdersController], providers:[OrdersService,UserClient,RestaurantClient]}) export class OrdersModule{}
