// transactions.service.ts
import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
  TransactionStatus,
} from '../models/transaction.model';
import { Account, AccountDocument } from 'src/models/account.model';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async create({
    accountNumber,
    amount,
    description,
    type,
  }: CreateTransactionDto): Promise<{
    reference: string;
    status: TransactionStatus;
  }> {
    try {
      let transaction;
      switch (type) {
        case 'deposit':
          return this.deposit({
            accountNumber: accountNumber,
            amount: amount,
            description: description,
            type: type,
          });
          break;
        case 'withdraw':
          return this.withdraw(accountNumber, amount);
          break;
        default:
          break;
      }
    } catch (error) {}
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findOne(id: string): Promise<Transaction> {
    return this.transactionModel.findById(id).exec();
  }

  async deposit({
    accountNumber,
    amount,
    description,
    type,
  }: CreateTransactionDto): Promise<{
    reference: string;
    status: TransactionStatus;
  }> {
    const session = await this.transactionModel.startSession();
    try {
      if (amount <= 0) throw new Error('Invalid amount');
      const account = await this.accountModel
        .findOne({ accountNumber: accountNumber })
        .exec();

      if (!account) throw new Error('Account not found');

      const reference = uuidv4();
      const createdTransaction = new this.transactionModel({
        type: type,
        amount: amount,
        accountNumber: accountNumber,
        description: description,
        status: TransactionStatus.PENDING,
      });
      createdTransaction.reference = reference;

      const a = await this.accountModel
        .findOneAndUpdate(
          { accountNumber: accountNumber },
          { balance: account.balance + amount },
        )
        .exec();
      a.save({ session });
      createdTransaction.status = TransactionStatus.SUCCESS;
      await createdTransaction.save({ session });

      return {
        reference: reference,
        status: TransactionStatus.SUCCESS,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async withdraw(
    accountNumber: number,
    amount: number,
  ): Promise<{
    reference: string;
    status: TransactionStatus;
  }> {
    const session = await this.transactionModel.startSession();
    try {
      session.startTransaction();

      if (amount <= 0) {
        throw new Error('Invalid amount');
      }
      const account = await this.accountModel
        .findOne({ accountNumber: accountNumber })
        .exec();
      if (account.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const reference = uuidv4();
      const createdTransaction = new this.transactionModel({
        type: 'withdraw',
        amount: amount,
        accountNumber: accountNumber,
        status: TransactionStatus.PENDING,
      });
      //more validations e.g daily limit,
      const a = await this.accountModel
        .findOneAndUpdate(
          { accountNumber: accountNumber },
          { balance: account.balance - amount },
        )
        .exec();
      await a.save({ session });
      createdTransaction.status = TransactionStatus.SUCCESS;
      await createdTransaction.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        reference: reference,
        status: TransactionStatus.SUCCESS,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new HttpException(error.message, 500);
    }
  }
}
