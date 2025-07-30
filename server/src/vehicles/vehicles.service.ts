import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Vehicle, VehicleDocument } from "./schemas/vehicle.schema";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";


@Injectable()
export class VehiclesService {
    
    constructor(
        @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    ) {}
    
    async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
        const createdVehicle = new this.vehicleModel(createVehicleDto);
        return createdVehicle.save();
    }
    
    async findAll() {
        return this.vehicleModel.find().exec();
    }

    async findOne(id: string) {
        const vehicle = await this.vehicleModel.findById(id).exec();
        if (!vehicle) {
            throw new NotFoundException(`Veículo com ID #${id} não encontrado`);
        }
        return vehicle;
    }

    async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
        const existingVehicle = await this.vehicleModel
            .findByIdAndUpdate(id, updateVehicleDto, { new: true })
            .exec();
            
        if (!existingVehicle) {
            throw new NotFoundException(`Veículo com ID #${id} não encontrado`);
        }
        
        return existingVehicle;
    }

    async remove(id: string) {
        const result = await this.vehicleModel.findByIdAndDelete(id).exec();
        if(!result) {
            throw new NotFoundException(`Veículo com ID #${id} não encontrado`);    
        }
    }
}