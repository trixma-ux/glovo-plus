import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
export enum OrderStatusDto { EN_ATTENTE='EN_ATTENTE', VALIDEE='VALIDEE', PREPARATION='PREPARATION', LIVRAISON='LIVRAISON', LIVREE='LIVREE' }
export class UpdateOrderStatusDto { @ApiProperty({enum:OrderStatusDto}) @IsEnum(OrderStatusDto) status:OrderStatusDto; }
