import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { DeliveriesService } from './deliveries.service';
@ApiTags('Deliveries') @Controller('deliveries') export class DeliveriesController{constructor(private readonly service:DeliveriesService){} @Post() create(@Body() dto:CreateDeliveryDto){return this.service.create(dto)} @Get() findAll(){return this.service.findAll()} @Get(':id') findById(@Param('id') id:string){return this.service.findById(id)} @Patch(':id/status') updateStatus(@Param('id') id:string,@Body() dto:UpdateDeliveryStatusDto){return this.service.updateStatus(id,dto)} }
