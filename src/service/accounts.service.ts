// accounts.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from '../models/account.model';
import { generateBankAccountNumber } from './utils';

@Injectable()
export class AccountsService {
  constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}

  async create(): Promise<Account> {
    const ac = generateBankAccountNumber()
    Logger.error('ac :>> ', ac);
    const createdAccount = new this.accountModel({
      balance: 0,
      accountNumber: ac
    });
    this.accountModel.validate()
    return createdAccount.save();
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }

  async findOne(id: string): Promise<Account> {
    return this.accountModel.findById(id).exec();
  }

  async getAccountByCustomerId(id: string): Promise<Account> {
    return this.accountModel.findOne({customer: id}).exec();
  }

}
