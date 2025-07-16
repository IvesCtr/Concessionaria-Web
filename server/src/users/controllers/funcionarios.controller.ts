import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ValidationPipe, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';

@Controller('funcionarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.GERENTE)
export class FuncionariosController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    if (createUserDto.role === UserRole.CLIENTE) {
      throw new ForbiddenException('Não é possível criar um cliente por este endpoint.');
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    //Retorna todos os usuários que NÃO são clientes
    return this.usersService.findAll().then(users => 
      users.filter(user => user.role !== UserRole.CLIENTE)
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    if (updateUserDto.role === UserRole.CLIENTE) {
        throw new ForbiddenException('Não é possível alterar o cargo para cliente por este endpoint.');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}