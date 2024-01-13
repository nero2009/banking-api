// account.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from './customer.model';
import { Transaction } from './transaction.model';

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

  @Prop({
    type: Number,
    default: Date.now()
  })
  createdAt: number;

  @Prop({
    type: Number,
    default: Date.now()
  })
  updatedAt: number;

  @Prop({type: [Types.ObjectId], ref: Transaction.name })
  transactions: Types.ObjectId[];

  @Prop({type: Types.ObjectId, ref: Customer.name, required: true })
  customerId: Types.ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
