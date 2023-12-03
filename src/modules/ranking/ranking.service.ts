import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timer } from 'src/shared/entities/timer.entity';
import { StudentUser } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { TimerService } from '../timer/timer.service';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: Repository<Timer>,
    @InjectRepository(StudentUser)
    private readonly studentUserRepository: Repository<StudentUser>,
    private readonly timerService: TimerService,
  ) {}

  public async find() {
    const students = await this.studentUserRepository.find({
      select: ['id', 'username', 'profileImage'],
    });

    const ranking = await Promise.all(
      students.map(async (student) => {
        const timer = await this.timerService.getToday(student.id);
        return {
          id: student.id,
          username: student.username,
          profileImage: student.profileImage,
          totalTime: timer.totalTime,
        };
      }),
    );

    return ranking.sort((a, b) => b.totalTime - a.totalTime);
  }
}
