import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from 'class-validator';
export class CreateDeliveryDto { @ApiProperty({example:'order-uuid'}) @IsString() @IsNotEmpty() orderId:string; @ApiProperty({example:'livreur-uuid'}) @IsString() @IsNotEmpty() deliveryPersonId:string; @ApiProperty({example:5}) @IsNumber() @IsPositive() distance:number; @ApiProperty({example:3}) @IsInt() @Min(1) @Max(5) traffic:number; @ApiProperty({example:1}) @IsInt() @Min(1) @Max(5) weather:number; }
