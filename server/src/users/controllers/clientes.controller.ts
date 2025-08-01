import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ValidationPipe, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator'; 
import { UserRole } from '../enums/user-role.enum';
import { NotFoundException } from '@nestjs/common';

@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientesController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.FUNCIONARIO, UserRole.GERENTE)
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    if (createUserDto.role === UserRole.FUNCIONARIO) {
      throw new ForbiddenException('Não é possível criar um funcionário por este endpoint.');
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.FUNCIONARIO, UserRole.GERENTE)
  findAll() {
    return this.usersService.findAll(UserRole.CLIENTE);
  }

  @Get(':id')
  @Roles(UserRole.FUNCIONARIO, UserRole.GERENTE)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.FUNCIONARIO, UserRole.GERENTE)
  update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.GERENTE)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Adicione esta rota dentro da classe ClientesController

  @Get('cpf/:cpf')
  @Roles(UserRole.FUNCIONARIO, UserRole.GERENTE)
  async findOneByCpf(@Param('cpf') cpf: string) {
    const user = await this.usersService.findOneByCpf(cpf);
    if (!user) {
      throw new NotFoundException(`Cliente com CPF #${cpf} não encontrado.`);
    }
    // Garante que apenas clientes sejam retornados por este endpoint
    if (user.role !== UserRole.CLIENTE) {
      throw new NotFoundException(`Nenhum cliente encontrado com o CPF #${cpf}.`);
    }
    return user;
  }
}