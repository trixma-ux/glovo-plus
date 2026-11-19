import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';
import { ADMIN, LIVREUR, isInternalCall, requireRole, requireUser } from '../common/auth/auth.util';

@ApiTags('Orders') @ApiBearerAuth() @Controller('orders')
export class OrdersController {
  constructor(private readonly service:OrdersService){}

  /** Créer : utilisateur connecté ; un non-admin ne commande que pour lui-même. */
  @Post() create(@Body() dto:CreateOrderDto, @Req() req:any){
    const u = requireUser(req);
    if (u.role !== ADMIN) dto.userId = u.userId;
    return this.service.create(dto);
  }

  /** Liste : admin et livreurs voient tout, un client ne voit que ses commandes. */
  @Get() findAll(@Req() req:any){
    const u = requireUser(req);
    return this.service.findAll(u.role === ADMIN || u.role === LIVREUR ? undefined : u.userId);
  }

  @Get(':id') async findById(@Param('id') id:string, @Req() req:any){
    const order = await this.service.findById(id);
    if (!isInternalCall(req)) {
      const u = requireUser(req);
      if (u.role !== ADMIN && u.role !== LIVREUR && order.userId !== u.userId) throw new ForbiddenException('Accès refusé');
    }
    return order;
  }

  @Patch(':id/status') updateStatus(@Param('id') id:string, @Body() dto:UpdateOrderStatusDto, @Req() req:any){
    requireRole(req, ADMIN, LIVREUR);
    return this.service.updateStatus(id,dto);
  }
}
