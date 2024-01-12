import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop({ type: Types.ObjectId, ref: 'Account', required: true  })
  account: Types.ObjectId;

  
  @Prop({
    type: String,
  })
  firstName: string;

  @Prop({
    type: String,
  })
  lastName: string;

  @Prop({
    type: String,
    unique: true
  })
  email: string;

  @Prop({
    type: Number,
    default: Date.now()
  })
  createdAt: Date;

  @Prop({
    type: Number,
    default: Date.now()
  })
  dateOfBirth: Date;

  @Prop({
    type: String,
    unique: true
  })
  socialSecurityNumber: string;

  @Prop({
    type: String,
  })
  address: string;

}

export const UserSchema = SchemaFactory.createForClass(Customer);