import { Module } from '@nestjs/common';
import { FineService } from './fine.service';
import { TimerService } from '../timer/timer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timer } from 'src/shared/entities/timer.entity';
import { StudentUser } from 'src/shared/entities/user.entity';
import { FineController } from './fine.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timer, StudentUser]),
    ScheduleModule.forRoot(),
  ],
  providers: [FineService, TimerService],
  controllers: [FineController],
})
export class FineModule {}
