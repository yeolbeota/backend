import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FineService } from './fine.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { User } from 'src/shared/decorator/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('fine')
@ApiTags('Fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Get()
  @UseGuards(AccessGuard)
  async find() {
    return await this.fineService.getFineAll();
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  async findOne(@Param('id') id: string) {
    return await this.fineService.getFineById(id);
  }

  @Get('me')
  @UseGuards(AccessGuard)
  async findMe(@User() user: Express.User) {
    return await this.fineService.getFineById(user.id);
  }
}
