import { IsEnum, isNotEmpty, IsNotEmpty, IsNumber, IsPositive, isString, IsString } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  imagemUrl: string;

  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}