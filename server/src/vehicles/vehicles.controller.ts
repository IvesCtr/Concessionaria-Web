// Versão CORRIGIDA do seu vehicles.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, // Garanta que UseGuards está importado
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // E o AuthGuard também
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
// A LINHA DE PROTEÇÃO FOI REMOVIDA DAQUI
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(AuthGuard()) // PROTEGIDO: Apenas usuários logados podem criar
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  // PÚBLICO: Qualquer um pode listar os veículos
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  // PÚBLICO: Qualquer um pode ver os detalhes de um veículo
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard()) // PROTEGIDO: Apenas usuários logados podem editar
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard()) // PROTEGIDO: Apenas usuários logados podem deletar
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}