import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    controllers: [],
    providers: [UsersResolver, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
