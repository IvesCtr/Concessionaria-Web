// /server/src/vehicles/schemas/vehicle.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum VehicleStatus {
  DISPONIVEL = 'disponivel',
  VENDIDO = 'vendido',
}

export type VehicleDocument = Vehicle & Document;

@Schema({
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => { delete ret._id; delete ret.__v; },
  },
})
export class Vehicle {
  id: string;

  @Prop({ required: true })
  marca: string;
  
  @Prop({ required: true })
  modelo: string;

  @Prop({ required: true })
  ano: number;

  @Prop({ required: true })
  cor: string;

  @Prop({ required: true })
  preco: number;
  
  @Prop({ type: String, required: true, enum: VehicleStatus, default: VehicleStatus.DISPONIVEL })
  status: VehicleStatus;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
VehicleSchema.virtual('id').get(function () {
  return this._id.toHexString();
});