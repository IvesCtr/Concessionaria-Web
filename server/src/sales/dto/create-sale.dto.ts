import { IsMongoId, IsNumber, IsPositive, IsString, Matches } from 'class-validator';

export class CreateSaleDto {
  @IsMongoId({ message: 'O ID do veículo é inválido.' })
  vehicleId: string;

  @IsString()
  @Matches(/^\d{11}$/, { message: 'O CPF do cliente deve conter exatamente 11 dígitos numéricos.' })
  clienteCpf: string;

  @IsString()
  @Matches(/^\d{11}$/, { message: 'O CPF do funcionário deve conter exatamente 11 dígitos numéricos.' })
  funcionarioCpf: string;

  @IsNumber()
  @IsPositive()
  finalPrice: number;
}