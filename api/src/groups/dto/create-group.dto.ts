import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@ObjectType()
export class GroupType {
    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    readonly id?: string;
    @Field(() => String, { description: 'Name of the group' })
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    @Field(() => [String], { description: 'Users of the group' })
    readonly users: [string];
}
