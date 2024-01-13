import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post()
  createTransaction(
    @Body() depositDTO: CreateTransactionDto,
  ) {
    return this.transactionService.create({
      accountNumber: depositDTO.accountNumber,
      amount: depositDTO.amount,
      description: depositDTO.description,
      type: depositDTO.type,
    });
  }

  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
}