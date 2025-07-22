import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ValidationPipe, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard'; // Adjust the path if necessary
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicles.service';


@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    @Get()
    findAll() {
        return this.vehiclesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vehiclesService.findOne(id);
    }

    @UseGuards(RolesGuard)
    @Post()
    create(@Body() createVehicleDto: CreateVehicleDto) {
        return this.vehiclesService.create(createVehicleDto);
    }

    @UseGuards(RolesGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vehiclesService.remove(id);
    }
}