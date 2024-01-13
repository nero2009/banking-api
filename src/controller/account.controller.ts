
// account.controller.ts
import { Controller, Post, Param, Get, Logger } from '@nestjs/common';
import { AccountsService } from '../service/accounts.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountsService) {}

  @Get()
  getAccounts() {
    return this.accountService.findAll();
  }
  
  @Post(':customerId')
  createAccount(@Param('customerId') customerId: string) {
    return this.accountService.create(customerId);
  }

  @Get(':id')
  getAccountById(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }
}
