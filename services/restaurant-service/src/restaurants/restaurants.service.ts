import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
@Injectable()
export class RestaurantsService { constructor(private readonly prisma:PrismaService){}
 create(dto:CreateRestaurantDto){ return this.prisma.restaurant.create({data:{...dto, isOpen:dto.isOpen ?? true}}); }
 findAll(){ return this.prisma.restaurant.findMany({include:{products:true}, orderBy:{createdAt:'desc'}}); }
 async findById(id:string){ const r=await this.prisma.restaurant.findUnique({where:{id}, include:{products:true}}); if(!r) throw new NotFoundException('Restaurant introuvable'); return r; }
 async update(id:string,dto:UpdateRestaurantDto){ await this.findById(id); return this.prisma.restaurant.update({where:{id}, data:dto}); }
 async delete(id:string){ await this.findById(id); return this.prisma.restaurant.delete({where:{id}}); }
}
