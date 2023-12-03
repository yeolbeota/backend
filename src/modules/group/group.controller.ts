import { Controller, Get, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { User } from 'src/shared/decorator/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('group')
@ApiTags('Group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async find(@User() user: Express.User) {
    return await this.groupService.findOne(user);
  }
}
