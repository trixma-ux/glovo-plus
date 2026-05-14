import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
export enum DeliveryStatusDto { EN_ATTENTE='EN_ATTENTE', EN_COURS='EN_COURS', LIVRE='LIVRE' }
export class UpdateDeliveryStatusDto { @ApiProperty({enum:DeliveryStatusDto}) @IsEnum(DeliveryStatusDto) status:DeliveryStatusDto; }
