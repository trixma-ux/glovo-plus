import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';
@ApiTags('Orders') @Controller('orders') export class OrdersController { constructor(private readonly service:OrdersService){} @Post() create(@Body() dto:CreateOrderDto){return this.service.create(dto)} @Get() findAll(){return this.service.findAll()} @Get(':id') findById(@Param('id') id:string){return this.service.findById(id)} @Patch(':id/status') updateStatus(@Param('id') id:string,@Body() dto:UpdateOrderStatusDto){return this.service.updateStatus(id,dto)} }
