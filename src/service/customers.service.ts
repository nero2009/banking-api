// users.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, UserDocument } from '../models/customer.model';
import { Account, AccountDocument } from 'src/models/account.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Customer.name) private userModel: Model<UserDocument>, @InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}

  async create(user): Promise<Customer> {

    try {
      const createdUser = new this.userModel(user);
      const account = await this.accountModel.create({})
      createdUser.account = account._id;
      return createdUser.save();
    } catch (error) {
      throw new Error(error.message);
    }
    
  }

  async findAll(): Promise<Customer[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<Customer> {
    return this.userModel.findById(id).exec();
  }

  async delete(id: string): Promise<Customer> {
    return this.userModel.findByIdAndDelete(id);
  }

  async update(id: string, user: Customer): Promise<Customer> {
    return this.userModel.findOneAndUpdate({ _id: id }, user, { new: true });
  }
}
