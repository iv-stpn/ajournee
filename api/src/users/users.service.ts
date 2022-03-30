import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserType } from './dto/create-user.dto';
import { UserInput, UpdateUserInput, FilterUserInput } from './input-users.input';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

    async create(createUserDto: UserInput): Promise<UserType> {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    async findAll(): Promise<UserType[]> {
        return await this.userModel.find().exec();
    }

    async findOne(id: string, email = false): Promise<UserType> {
        if (email) {
            return await this.userModel.findOne({ email: id });
        }
        return await this.userModel.findOne({ _id: id });
    }

    async findByCriteria(filter: FilterUserInput): Promise<UserType[]> {
        return await this.userModel.find(filter).exec();
    }

    async delete(id: string): Promise<UserType> {
        return await this.userModel.findByIdAndRemove(id);
    }

    async update(id: string, user: User): Promise<UserType> {
        return await this.userModel.findByIdAndUpdate(id, user as User, { new: true });
    }
}
