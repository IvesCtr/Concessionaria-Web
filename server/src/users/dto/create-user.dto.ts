import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, Matches } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'O CPF deve conter exatamente 11 dígitos numéricos (apenas números).',
  })
  cpf: string;
}