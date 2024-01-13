import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';


export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop({ type: Types.ObjectId, ref: 'Account', required: true  })
  account: Types.ObjectId;

  @Prop({
    type: String,
    required: true
  })
  firstName: string;

  @Prop({
    type: String,
    required: true
  })
  lastName: string;

  @Prop({
    type: String,
    unique: true,
    required: true
  })
  email: string;

  @Prop({
    type: Number,
    default: Date.now()
  })
  createdAt: Date;

  @Prop({
    type: Number,
    required: true
  })
  dateOfBirth: number;

  @Prop({
    type: String,
    unique: true,
    required: true
  })
  socialSecurityNumber: string;

  @Prop({
    type: String,
    required: true
  })
  address: string;

  @Prop({ required: true })
  password: string;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);