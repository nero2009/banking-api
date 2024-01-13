
// account.controller.ts
import { Controller, Post, Param, Get } from '@nestjs/common';
import { AccountsService } from '../service/accounts.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountsService) {}

  @Get(':id')
    getAccountByCustomerId(@Param('id') id: string) {
      return this.accountService.getAccountByCustomerId(id);
    }
  // getAccountByCustom(@Param('id') id: string) {
  //   return this.accountService.getAccountById(id);
  // }

  // @Post(':customerId')
  // createAccount(@Param('customerId') customerId: string) {
  //   return this.accountService.create(customerId);
  // }

  // @Get(':id')
  // getAccountById(@Param('id') id: string) {
  //   return this.accountService.getAccountById(id);
  // }
}
