import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
@ApiTags('Restaurants') @Controller('restaurants') export class RestaurantsController { constructor(private readonly service:RestaurantsService){} @Post() create(@Body() dto:CreateRestaurantDto){return this.service.create(dto)} @Get() findAll(){return this.service.findAll()} @Get(':id') findById(@Param('id') id:string){return this.service.findById(id)} @Patch(':id') update(@Param('id') id:string,@Body() dto:UpdateRestaurantDto){return this.service.update(id,dto)} @Delete(':id') delete(@Param('id') id:string){return this.service.delete(id)} }
