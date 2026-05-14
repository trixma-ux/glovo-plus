import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MlClient } from '../clients/ml.client';
import { OrderClient } from '../clients/order.client';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
@Injectable() export class DeliveriesService { constructor(private prisma:PrismaService, private orderClient:OrderClient, private mlClient:MlClient){}
 async create(dto:CreateDeliveryDto){ await this.orderClient.getOrderById(dto.orderId); const estimatedTime=await this.mlClient.predictTime(dto.distance,dto.traffic,dto.weather); return this.prisma.delivery.create({data:{...dto, estimatedTime}}); }
 findAll(){return this.prisma.delivery.findMany({orderBy:{createdAt:'desc'}})}
 async findById(id:string){const d=await this.prisma.delivery.findUnique({where:{id}}); if(!d) throw new NotFoundException('Livraison introuvable'); return d;}
 async updateStatus(id:string,dto:UpdateDeliveryStatusDto){await this.findById(id); return this.prisma.delivery.update({where:{id}, data:{status:dto.status}})}
}
