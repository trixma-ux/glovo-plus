import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
@ApiTags('Products') @Controller('products') export class ProductsController { constructor(private readonly service:ProductsService){} @Post() create(@Body() dto:CreateProductDto){return this.service.create(dto)} @Get() findAll(){return this.service.findAll()} @Get('batch') findMany(@Query('ids') ids:string){return this.service.findManyByIds((ids||'').split(',').map(x=>x.trim()).filter(Boolean))} @Get(':id') findById(@Param('id') id:string){return this.service.findById(id)} @Patch(':id') update(@Param('id') id:string,@Body() dto:UpdateProductDto){return this.service.update(id,dto)} @Patch(':id/availability') updateAvailability(@Param('id') id:string,@Body('isAvailable') isAvailable:boolean){return this.service.updateAvailability(id,isAvailable)} @Delete(':id') delete(@Param('id') id:string){return this.service.delete(id)} }
