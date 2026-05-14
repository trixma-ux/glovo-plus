import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post() @ApiOperation({ summary:'Créer utilisateur' }) create(@Body() dto:CreateUserDto){ return this.usersService.create(dto); }
  @Get() findAll(){ return this.usersService.findAll(); }
  @Get(':id') findById(@Param('id') id:string){ return this.usersService.findById(id); }
  @Patch(':id') update(@Param('id') id:string, @Body() dto:UpdateUserDto){ return this.usersService.update(id,dto); }
  @Patch(':id/deactivate') deactivate(@Param('id') id:string){ return this.usersService.deactivate(id); }
}
