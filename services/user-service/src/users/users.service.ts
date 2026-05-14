import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private safe(user: any) { const { password, ...safeUser } = user; return safeUser; }
  async create(dto: CreateUserDto) {
    if (await this.prisma.user.findUnique({ where: { email: dto.email } })) throw new BadRequestException('Cet email est déjà utilisé');
    const user = await this.prisma.user.create({ data: { ...dto, password: await bcrypt.hash(dto.password, 10), role: dto.role || 'CLIENT' } });
    return this.safe(user);
  }
  async findAll(){ return (await this.prisma.user.findMany({ orderBy: { createdAt:'desc' } })).map(u=>this.safe(u)); }
  async findById(id: string){ const user = await this.prisma.user.findUnique({ where:{ id } }); if(!user) throw new NotFoundException('Utilisateur introuvable'); return this.safe(user); }
  async findByEmail(email: string){ return this.prisma.user.findUnique({ where:{ email } }); }
  async update(id: string, dto: UpdateUserDto){ await this.findById(id); const data:any={...dto}; if(dto.password) data.password = await bcrypt.hash(dto.password,10); return this.safe(await this.prisma.user.update({ where:{id}, data })); }
  async deactivate(id: string){ await this.findById(id); return this.safe(await this.prisma.user.update({ where:{id}, data:{isActive:false} })); }
}
