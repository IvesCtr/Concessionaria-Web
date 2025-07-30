import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale, SaleSchema } from './schemas/sale.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      { name: User.name, schema: UserSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}