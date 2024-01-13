import { Controller, Get, Post, Body, Param, BadRequestException, HttpException, Put } from '@nestjs/common';
import { AccountsService } from '../service/accounts.service';
import {CustomersService} from '../service/customers.service';
import { CreateCustomerDto } from 'src/dto/create-customer.dto';
import { UpdateUserDto } from 'src/dto/update-customer.dto';

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

  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Get()
  getAllCustomers() {
    return this.customerService.findAll();
  }

  @Put(':id')
  updateCustomer(@Param('id') id: string, @Body() updateCustomerPayload: UpdateUserDto) {
    return this.customerService.update(id, updateCustomerPayload);
  }
}