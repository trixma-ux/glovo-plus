import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ADMIN, isInternalCall, optionalUser, requireRole, requireUser } from '../common/auth/auth.util';

const PUBLIC_SIGNUP_ROLES = ['CLIENT', 'LIVREUR'];

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Inscription publique (CLIENT/LIVREUR) ; créer un ADMIN exige un jeton admin. */
  @Post() @ApiOperation({ summary:'Créer utilisateur' })
  create(@Body() dto:CreateUserDto, @Req() req:any){
    if (dto.role && !PUBLIC_SIGNUP_ROLES.includes(dto.role)) requireRole(req, ADMIN);
    return this.usersService.create(dto);
  }

  /** Liste : admin uniquement. */
  @Get() findAll(@Req() req:any){ requireRole(req, ADMIN); return this.usersService.findAll(); }

  /** Détail : soi-même, admin, ou appel interne entre services. */
  @Get(':id') findById(@Param('id') id:string, @Req() req:any){
    if (!isInternalCall(req)) {
      const u = requireUser(req);
      if (u.role !== ADMIN && u.userId !== id) throw new ForbiddenException('Accès refusé');
    }
    return this.usersService.findById(id);
  }

  /** Modification : soi-même ou admin ; seul un admin peut changer le rôle. */
  @Patch(':id') update(@Param('id') id:string, @Body() dto:UpdateUserDto, @Req() req:any){
    const u = requireUser(req);
    if (u.role !== ADMIN && u.userId !== id) throw new ForbiddenException('Accès refusé');
    if (u.role !== ADMIN && dto.role !== undefined) throw new ForbiddenException('Seul un administrateur peut changer le rôle');
    return this.usersService.update(id,dto);
  }

  @Patch(':id/deactivate') deactivate(@Param('id') id:string, @Req() req:any){ requireRole(req, ADMIN); return this.usersService.deactivate(id); }
}
