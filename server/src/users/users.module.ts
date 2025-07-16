import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { ClientesController } from './controllers/clientes.controller';
import { FuncionariosController } from './controllers/funcionarios.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [ClientesController, FuncionariosController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}