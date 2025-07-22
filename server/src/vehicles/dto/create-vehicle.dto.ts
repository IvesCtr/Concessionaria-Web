import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { VehicleStatus } from '../schemas/vehicle.schema';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsNumber()
  @IsPositive()
  ano: number;

  @IsString()
  @IsNotEmpty()
  cor: string;

  @IsNumber()
  @IsPositive()
  preco: number;

  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}