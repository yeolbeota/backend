import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timer } from 'src/shared/entities/timer.entity';
import { StudentUser } from 'src/shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Timer, StudentUser])],
  controllers: [TimerController],
  providers: [TimerService],
})
export class TimerModule {}
