// /server/src/sales/sales.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from './schemas/sale.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Vehicle, VehicleDocument, VehicleStatus } from '../vehicles/schemas/vehicle.schema';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const { vehicleId, clienteId, funcionarioId } = createSaleDto;

    const vehicle = await this.vehicleModel.findById(vehicleId).exec();
    if (!vehicle || vehicle.status === VehicleStatus.VENDIDO) {
      throw new BadRequestException('Veículo inválido ou já vendido.');
    }

    const createdSale = new this.saleModel(createSaleDto);
    await this.vehicleModel.updateOne({ _id: vehicleId }, { status: VehicleStatus.VENDIDO }).exec();
    return createdSale.save();
  }
}