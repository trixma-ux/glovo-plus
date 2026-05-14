import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
export class CreateOrderItemDto { @ApiProperty({example:'product-uuid'}) @IsString() @IsNotEmpty() productId:string; @ApiProperty({example:2}) @IsInt() @IsPositive() quantity:number; }
export class CreateOrderDto { @ApiProperty({example:'user-uuid'}) @IsString() @IsNotEmpty() userId:string; @ApiProperty({example:'restaurant-uuid'}) @IsString() @IsNotEmpty() restaurantId:string; @ApiProperty({type:[CreateOrderItemDto]}) @IsArray() @ArrayMinSize(1) @ValidateNested({each:true}) @Type(()=>CreateOrderItemDto) items:CreateOrderItemDto[]; }
