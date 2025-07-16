import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { SalesModule } from './sales/sales.module';

const MONGO_URI = 'mongodb+srv://dbConcessionaria:159357dff@cluster0.swadma3.mongodb.net/concessionaria?retryWrites=true&w=majority&appName=Cluster0';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(MONGO_URI),
    AuthModule,
    UsersModule,
    VehiclesModule,
    SalesModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}