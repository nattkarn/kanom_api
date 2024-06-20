import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type OrderDocument = Order & Document;


@Schema({timestamps:true})
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId; //Reference to Product model

  @Prop({ required: true })
  quantity: string;


}

export const OrderSchema = SchemaFactory.createForClass(Order);