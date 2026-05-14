import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Injectable()
export class ProductsService { constructor(private readonly prisma:PrismaService){}
 async create(dto:CreateProductDto){ const r=await this.prisma.restaurant.findUnique({where:{id:dto.restaurantId}}); if(!r) throw new BadRequestException('Restaurant associé introuvable'); return this.prisma.product.create({data:{...dto, isAvailable:dto.isAvailable ?? true}, include:{restaurant:true}}); }
 findAll(){ return this.prisma.product.findMany({include:{restaurant:true}, orderBy:{createdAt:'desc'}}); }
 async findById(id:string){ const p=await this.prisma.product.findUnique({where:{id}, include:{restaurant:true}}); if(!p) throw new NotFoundException('Produit introuvable'); return p; }
 findManyByIds(ids:string[]){ return this.prisma.product.findMany({where:{id:{in:ids}}, include:{restaurant:true}}); }
 async update(id:string,dto:UpdateProductDto){ await this.findById(id); return this.prisma.product.update({where:{id}, data:dto, include:{restaurant:true}}); }
 async updateAvailability(id:string,isAvailable:boolean){ await this.findById(id); return this.prisma.product.update({where:{id}, data:{isAvailable}}); }
 async delete(id:string){ await this.findById(id); return this.prisma.product.delete({where:{id}}); }
}
