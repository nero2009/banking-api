// transactions.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
  TransactionStatus,
} from '../models/transaction.model';
import { Account, AccountDocument } from 'src/models/account.model';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(transaction);
    return createdTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findOne(id: string): Promise<Transaction> {
    return this.transactionModel.findById(id).exec();
  }

  async deposit(accountNumber: string, amount: number): Promise<Transaction> {
    try {
      if (amount <= 0) throw new Error('Invalid amount');
      const account = await this.accountModel
        .findOne({ accountNumber: accountNumber })
        .exec();
      const transaction = this.create({
        type: 'deposit',
        amount: amount,
        accountNumber: accountNumber,
        account: account._id,
        description: 'Deposit',
        reference: '123456',
        status: TransactionStatus.SUCCESS,
      });

      return transaction;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async withdraw(accountNumber: string, amount: number): Promise<Transaction> {
    const session = await this.transactionModel.startSession();
    try {
      session.startTransaction();

      if (amount <= 0){
        await session.abortTransaction();
         throw new Error('Invalid amount')
        };
      const account = await this.accountModel
        .findOne({ accountNumber: accountNumber })
        .exec();
      if (account.balance < amount){
        
        await session.abortTransaction();
         throw new Error('Insufficient balance')
      };
      //more validations e.g daily limit,
      const a = this.accountModel
        .findOneAndUpdate(
          { accountNumber: accountNumber },
          { balance: account.balance - amount },
        )
        .exec();

      await session.commitTransaction();
      return this.create({
        type: 'withdraw',
        amount: amount,
        accountNumber: accountNumber,
        account: account._id,
        description: 'Withdraw',
        reference: uuidv4(),
        status: TransactionStatus.SUCCESS,
      });
    } catch (error) {
      await session.abortTransaction();
      throw new Error(error.message);
    }
  }
}
