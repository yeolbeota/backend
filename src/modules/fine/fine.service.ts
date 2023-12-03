import { Injectable } from '@nestjs/common';
import { TimerService } from '../timer/timer.service';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentUser } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { getDate } from 'src/utils/getDate';

@Injectable()
export class FineService {
  constructor(
    private readonly timerService: TimerService,
    @InjectRepository(StudentUser)
    private readonly studentUser: Repository<StudentUser>,
  ) {}

  @Cron('0 0 5 * * *')
  public async handleFine() {
    const resetTime = getDate(getDate().setHours(-19, 0, 0, 0));
    const students = await this.studentUser.find();

    for (const student of students) {
      const timers = await this.timerService.getStudyTimeByDate(
        student.id,
        resetTime,
      );

      if (timers.totalTime / 3600000 < 2) {
        student.fine += 3000;
        student.fineStatus = false;
        await this.studentUser.save(student);
      } else {
        student.fineStatus = true;
        await this.studentUser.save(student);
      }
    }
  }

  public async getFineAll() {
    const students = await this.studentUser.find({
      select: ['id', 'username', 'fine', 'fineStatus'],
    });
    return students;
  }

  public async getFineById(id: string) {
    const student = await this.studentUser.findOne({
      where: { id },
      select: ['id', 'username', 'fine', 'fineStatus'],
    });
    return student;
  }
}
