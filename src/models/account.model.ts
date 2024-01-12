// account.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from './customer.model';

export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({
    default: 0,
    type: Number,
    required: true,
    isRequired: true,

  })
  balance: number;

  @Prop({
    required: true,
    type: Number,
    isRequired: true,
  })
  accountNumber: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;


}

export const AccountSchema = SchemaFactory.createForClass(Account);
