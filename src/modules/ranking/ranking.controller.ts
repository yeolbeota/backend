import { Controller, Get, UseGuards } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('ranking')
@ApiTags('Ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async find() {
    return await this.rankingService.find();
  }
}
