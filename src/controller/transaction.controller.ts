import { Controller, Post, Param, Body, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto';
import { AuthGuard } from 'src/auth.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionsService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
}