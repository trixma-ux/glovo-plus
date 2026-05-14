import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RestaurantClient } from '../clients/restaurant.client';
import { UserClient } from '../clients/user.client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
@Injectable() export class OrdersService { constructor(private prisma:PrismaService, private userClient:UserClient, private restaurantClient:RestaurantClient){}
 async create(dto:CreateOrderDto){ await this.userClient.getUserById(dto.userId); const ids=dto.items.map(i=>i.productId); const products=await this.restaurantClient.getProductsByIds(ids); if(products.length!==ids.length) throw new BadRequestException('Certains produits sont introuvables'); let totalAmount=0; const items=dto.items.map(item=>{ const p=products.find((x:any)=>x.id===item.productId); if(!p) throw new BadRequestException(`Produit ${item.productId} introuvable`); if(!p.isAvailable) throw new BadRequestException(`Le produit ${p.name} est indisponible`); if(p.restaurantId!==dto.restaurantId) throw new BadRequestException(`Le produit ${p.name} n’appartient pas au restaurant choisi`); const subtotal=p.price*item.quantity; totalAmount+=subtotal; return {productId:p.id, productName:p.name, unitPrice:p.price, quantity:item.quantity, subtotal}; }); return this.prisma.order.create({data:{userId:dto.userId,restaurantId:dto.restaurantId,totalAmount,items:{create:items}}, include:{items:true}}); }
 findAll(){return this.prisma.order.findMany({include:{items:true}, orderBy:{createdAt:'desc'}})}
 async findById(id:string){const o=await this.prisma.order.findUnique({where:{id}, include:{items:true}}); if(!o) throw new NotFoundException('Commande introuvable'); return o;}
 async updateStatus(id:string,dto:UpdateOrderStatusDto){await this.findById(id); return this.prisma.order.update({where:{id}, data:{status:dto.status}, include:{items:true}})}
}
