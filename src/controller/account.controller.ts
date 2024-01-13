
// account.controller.ts
import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import { AccountsService } from '../service/accounts.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountsService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAccounts() {
    return this.accountService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post(':customerId')
  createAccount(@Param('customerId') customerId: string) {
    return this.accountService.create(customerId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getAccountById(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }
}
