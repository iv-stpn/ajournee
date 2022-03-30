import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Module({
    providers: [GroupsService],
})
export class GroupsModule {}
