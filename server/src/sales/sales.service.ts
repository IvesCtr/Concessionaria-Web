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
    const { vehicleId, clienteCpf, funcionarioCpf, finalPrice } = createSaleDto;

    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID #${vehicleId} não encontrado.`);
    }
    if (vehicle.status === VehicleStatus.VENDIDO) {
      throw new BadRequestException(`Veículo com ID #${vehicleId} já foi vendido.`);
    }

    const cliente = await this.userModel.findOne({ cpf: clienteCpf, role: UserRole.CLIENTE });
    if (!cliente) {
      throw new NotFoundException(`Cliente com CPF #${clienteCpf} não encontrado.`);
    }

    const funcionario = await this.userModel.findOne({ cpf: funcionarioCpf, role: { $in: [UserRole.FUNCIONARIO, UserRole.GERENTE] } });
    if (!funcionario) {
      throw new NotFoundException(`Funcionário com CPF #${funcionarioCpf} não encontrado.`);
    }
    
    const createdSale = new this.saleModel({
      vehicle: vehicleId,
      cliente: cliente._id,
      funcionario: funcionario._id,
      finalPrice,
    });
    
    await this.vehicleModel.updateOne({ _id: vehicleId }, { status: VehicleStatus.VENDIDO });

    const savedSale = await createdSale.save();
    return this.findById(savedSale.id);
  }
  
  findAll(): Promise<Sale[]> {
    return this.saleModel
      .find()
      .populate('vehicle', 'marca modelo')
      .populate('cliente', 'name')
      .populate('funcionario', 'name')
      .sort({ saleDate: 'desc' })
      .exec();
  }

  async findById(id: string): Promise<Sale> {
    const sale = await this.saleModel
      .findById(id)
      .populate('vehicle', 'marca modelo')
      .populate('cliente', 'name')
      .populate('funcionario', 'name')
      .exec();

    if (!sale) {
      throw new NotFoundException(`Venda com ID #${id} não encontrada.`);
    }
    
    return sale;
  }
}