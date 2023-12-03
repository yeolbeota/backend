import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timer } from 'src/shared/entities/timer.entity';
import { StudentUser } from 'src/shared/entities/user.entity';
import { TimerService } from '../timer/timer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timer, StudentUser])],
  controllers: [RankingController],
  providers: [RankingService, TimerService],
})
export class RankingModule {}
