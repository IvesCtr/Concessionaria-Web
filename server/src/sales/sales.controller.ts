import { Controller, Get, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller() 
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('vendas')
  @Roles(UserRole.FUNCIONARIO, UserRole.GERENTE)
  create(@Body(ValidationPipe) createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get('historico')
  @Roles(UserRole.FUNCIONARIO, UserRole.GERENTE)
  findAll() {
    return this.salesService.findAll();
  }
}