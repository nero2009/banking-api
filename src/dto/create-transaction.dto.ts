import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;
}
