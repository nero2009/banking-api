// users.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from '../models/customer.model';
import { Account, AccountDocument } from 'src/models/account.model';
import { CreateCustomerDto } from 'src/dto/create-customer.dto';
import { generateBankAccountNumber } from './utils';
import { AccountsService } from './accounts.service';
import { UpdateUserDto } from 'src/dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: CreateCustomerDto): Promise<Customer> {
    const session = await this.customerModel.startSession();
    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword

    session.startTransaction();
    try {
      const account = new this.accountModel({
        balance: 0,
        accountNumber: generateBankAccountNumber(),
      });

      const createdUser = new this.customerModel(user);
      createdUser.account = account._id;
      await createdUser.save({ session });
      account.customerId = createdUser._id;
      await account.save({ session });
      await session.commitTransaction();
      session.endSession();
      return createdUser;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(error.message);
    }
  }

  async login(email: string, password: string): Promise<{
    accessToken: string;
    customer: Customer;
  }> {
    const user = await this.customerModel.findOne({ email }).exec();

    if (!user || !(bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, customer: user };
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  async findOne(id: string): Promise<Customer> {
    return this.customerModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<Customer> {
    return this.customerModel.findOne({ email }).exec();
  }

  async delete(id: string): Promise<Customer> {
    return this.customerModel.findByIdAndDelete(id);
  }

  async update(id: string, user: UpdateUserDto): Promise<Customer> {
    return this.customerModel.findOneAndUpdate({ _id: id }, user, {
      new: true,
    });
  }

  async getAccountByCustomerId(customerId: string): Promise<Customer> {
    const customer = await this.customerModel
      .findById(customerId)
      .populate('account')
      .exec();
    return customer;
  }
}
