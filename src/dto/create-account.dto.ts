import { Types } from "mongoose";

export class CreateAccountDto {
    readonly balance: number;
    readonly accountNumber: number;
    readonly transactions: string[];
}