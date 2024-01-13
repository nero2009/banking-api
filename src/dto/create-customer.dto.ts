import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCustomerDto {

    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @IsString()
    readonly email: string;

    @IsString()
    readonly phone: string;

    @IsNumber()
    readonly dateOfBirth: number;

    @IsString()
    readonly socialSecurityNumber: string;

    @IsString()
    readonly address: string;
}