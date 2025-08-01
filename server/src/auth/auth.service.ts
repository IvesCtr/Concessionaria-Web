import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string):   Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    // A ALTERAÇÃO É AQUI: Adicionamos o 'name' ao payload do token.
    const payload = { 
      email: user.email, 
      sub: user._id, 
      role: user.role,
      name: user.name // <-- LINHA ADICIONADA
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
