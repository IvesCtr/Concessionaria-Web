import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Vehicle } from '../../vehicles/schemas/vehicle.schema';

export type SaleDocument = Sale & Document;

@Schema({ 
    timestamps: { createdAt: 'saleDate' },
    toJSON: { virtuals: true, transform: (doc, ret: any) => { delete ret._id; delete ret.__v; } } 
})
export class Sale {
  id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Vehicle;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  cliente: User;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  funcionario: User;
  
  @Prop({ required: true })
  finalPrice: number;

  saleDate: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
SaleSchema.virtual('id').get(function () { return this._id.toHexString(); });