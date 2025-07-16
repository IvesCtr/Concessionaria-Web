// /server/src/sales/dto/create-sale.dto.ts
import { IsNumber, IsPositive } from 'class-validator';

export class CreateSaleDto {
  @IsNumber()
  @IsPositive()
  vehicleId: number;

  @IsNumber()
  @IsPositive()
  clienteId: number;

  @IsNumber()
  @IsPositive()
  funcionarioId: number;

  @IsNumber()
  @IsPositive()
  finalPrice: number;
}