import { Controller, Get, Post, Body, Param, BadRequestException, HttpException, Put, UseGuards } from '@nestjs/common';
import { AccountsService } from '../service/accounts.service';
import {CustomersService} from '../service/customers.service';
import { CreateCustomerDto } from 'src/dto/create-customer.dto';
import { UpdateUserDto } from 'src/dto/update-customer.dto';
import { Customer } from 'src/models/customer.model';
import { AuthGuard } from 'src/auth.guard';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomersService) {}

  @Post()
  createCustomer(@Body() createCustomerPayload: CreateCustomerDto) {
    try {
      return this.customerService.create(createCustomerPayload)   
    } catch (error) {
      throw new HttpException('Internal Error', 500)
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAllCustomers() {
    return this.customerService.findAll();
  }



  @UseGuards(AuthGuard)
  @Put(':id')
  updateCustomer(@Param('id') id: string, @Body() updateCustomerPayload: UpdateUserDto) {
    return this.customerService.update(id, updateCustomerPayload);
  }

  @UseGuards(AuthGuard)
  @Get(':id/account')
  getAccountByCustomerId(@Param('id') id: string) {
    return this.customerService.getAccountByCustomerId(id);
  }

  @Post('signin')
  async signIn(@Body('email') email: string, @Body('password') password: string): Promise<{ accessToken: string, customer: Customer }> {
    const {accessToken,  customer} = await this.customerService.login(email, password);
    return { accessToken,  customer  };
  }
}