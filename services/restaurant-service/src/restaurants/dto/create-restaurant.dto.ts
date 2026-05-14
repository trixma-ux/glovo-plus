import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateRestaurantDto { @ApiProperty({example:'Chez Tantie Awa'}) @IsString() @IsNotEmpty() name:string; @ApiProperty({required:false}) @IsOptional() @IsString() description?:string; @ApiProperty({example:'Cocody Angré'}) @IsString() @IsNotEmpty() address:string; @ApiProperty({required:false}) @IsOptional() @IsString() phone?:string; @ApiProperty({example:true, required:false}) @IsOptional() @IsBoolean() isOpen?:boolean; }
