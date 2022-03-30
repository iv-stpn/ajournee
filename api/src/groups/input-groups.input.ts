import { InputType, Field } from '@nestjs/graphql';
import { FilterableField } from '@nestjs-query/query-graphql';
import { IsString } from 'class-validator';

@InputType()
export class GroupInput {
    @IsString()
    @Field(() => String, { description: 'Name of the group' })
    readonly name: string;
    @Field(() => [String], { description: 'Users of the group' })
    readonly lastName: string;
}

@InputType()
export class FilterGroupInput {
    @FilterableField(() => [String], { nullable: true, description: 'Name of the group' })
    readonly name?: [string];
    @FilterableField(() => [String], { nullable: true, description: 'With users in the group' })
    readonly users?: [string];
}
