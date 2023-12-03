import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TimerService } from './timer.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorator/user.decorator';

@Controller('timer')
@ApiTags('Timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get('today')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async today(@User() user: Express.User) {
    return await this.timerService.getToday(user.id);
  }

  @Get('today/:id')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async todayById(@Param('id') id: string) {
    return await this.timerService.getToday(id);
  }

  @Get('status')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async status(@User() user: Express.User) {
    return await this.timerService.isActiveTimer(user.id);
  }

  @Post('start')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async start(@User() user: Express.User) {
    return await this.timerService.start(user);
  }

  @Post('stop')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async stop(@User() user: Express.User) {
    return await this.timerService.stop(user);
  }

  @Get('total')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async total(@User() user: Express.User) {
    return await this.timerService.getTotal(user.id);
  }
}
