// transaction.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Account } from './account.model';

export type TransactionDocument = Transaction & Document;

export enum TransactionStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCESS = 'success',
}

@Schema()
export class Transaction {

  @Prop()
  type: string;

  @Prop()
  amount: number;

  @Prop({
    default: Date.now(),
    required: false
  })
  timestamp?: number;

  @Prop({
    default: Date.now(),
    required: false
  })
  createdAt?: number;

  @Prop({
    default: Date.now(),
    required: false
  })
  updatedAt?: number;

  @Prop({
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status?: TransactionStatus;

  @Prop({
    required: false
  })
  description?: string;

  @Prop()
  reference: string;

  @Prop()
  accountNumber: string;

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
