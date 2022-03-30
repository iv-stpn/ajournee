import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

@ObjectType()
export class UserType {
    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    readonly id?: string;
    @Field(() => String, { description: 'First Name of the user' })
    @IsString()
    @IsNotEmpty()
    readonly firstName: string;
    @Field(() => String, { description: 'Last Name of the user' })
    @IsString()
    @IsNotEmpty()
    readonly lastName: string;
    @Field(() => String, { description: 'E-mail of the user' })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
    @Field(() => String, { description: 'Password of the user' })
    @IsString()
    @IsNotEmpty()
    readonly password: string;
    @Field(() => Date, { nullable: true, description: 'Birthdate of the user' })
    @IsDate()
    @IsOptional()
    readonly birthdate?: Date;
}
