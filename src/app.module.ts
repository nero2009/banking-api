import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Customer, CustomerSchema } from './models/customer.model';
import { Account, AccountSchema } from './models/account.model';
import { Transaction, TransactionSchema } from './models/transaction.model';
import { CustomerController } from './controller/customer.controller';
import { AccountController } from './controller/account.controller';
import { TransactionController } from './controller/transaction.controller';
import { CustomersService } from './service/customers.service';
import { AccountsService } from './service/accounts.service';
import { TransactionsService } from './service/transactions.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://user:giGspLO9ltfQW49X@cluster0.hj1pioe.mongodb.net/?retryWrites=true&w=majority', {
      dbName: 'banking_schema',
    }),
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  controllers: [AppController, CustomerController, AccountController, TransactionController],
  providers: [AppService, CustomersService, AccountsService, TransactionsService],
})

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
export class AppModule {}
