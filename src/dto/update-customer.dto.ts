import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateCustomerDto) {
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  readonly dateOfBirth: number;

  @IsOptional()
  @IsString()
  readonly address: string;
}