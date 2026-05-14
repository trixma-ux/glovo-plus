import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export enum UserRoleDto { CLIENT='CLIENT', LIVREUR='LIVREUR', ADMIN='ADMIN' }
export class CreateUserDto {
  @ApiProperty({ example: 'Kaba Ibrahim' }) @IsString() @IsNotEmpty() fullName: string;
  @ApiProperty({ example: 'ibrahim@example.com' }) @IsEmail() email: string;
  @ApiProperty({ example: '+2250700000000', required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ example: 'Password123' }) @IsString() @MinLength(6) password: string;
  @ApiProperty({ example: 'CLIENT', enum: UserRoleDto, required: false }) @IsOptional() @IsEnum(UserRoleDto) role?: UserRoleDto;
}
