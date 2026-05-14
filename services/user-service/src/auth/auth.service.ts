import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService { constructor(private readonly usersService:UsersService, private readonly jwtService:JwtService) {}
  async login(dto:LoginDto){ const user=await this.usersService.findByEmail(dto.email); if(!user || !user.isActive) throw new UnauthorizedException('Email ou mot de passe incorrect'); const ok=await bcrypt.compare(dto.password,user.password); if(!ok) throw new UnauthorizedException('Email ou mot de passe incorrect'); const payload={sub:user.id,email:user.email,role:user.role}; return { access_token: await this.jwtService.signAsync(payload), token_type:'Bearer', user:{id:user.id, fullName:user.fullName, email:user.email, phone:user.phone, role:user.role} }; }
}
