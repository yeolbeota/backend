import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timer } from 'src/shared/entities/timer.entity';
import { Repository } from 'typeorm';
import { getDate } from 'src/utils/getDate';
import { StudentUser } from 'src/shared/entities/user.entity';
import { timer } from 'rxjs';

@Injectable()
export class TimerService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: Repository<Timer>,
    @InjectRepository(StudentUser)
    private readonly studentRepository: Repository<StudentUser>,
  ) {}

  public async isActiveTimer(id: string) {
    const timer = await this.timerRepository
      .createQueryBuilder('timer')
      .where('timer.studentId = :studentId', { studentId: id })
      .orderBy('timer.startTime', 'DESC')
      .andWhere('timer.endTime IS NULL')
      .getOne();

    if (!timer) {
      return false;
    }

    return timer;
  }

  public async start(user: Express.User) {
    const isActiveTimer = await this.isActiveTimer(user.id);
    if (isActiveTimer)
      throw new HttpException(
        'You already have an active timer',
        HttpStatus.BAD_REQUEST,
      );

    const timer = this.timerRepository.create({
      student: user,
    });
    await this.timerRepository.save(timer);

    await this.studentRepository.update({ id: user.id }, { isStudy: true });

    return timer;
  }

  public async stop(user: Express.User) {
    const isActiveTimer = await this.isActiveTimer(user.id);
    if (!isActiveTimer) {
      throw new HttpException(
        "You don't have an active timer",
        HttpStatus.BAD_REQUEST,
      );
    }

    isActiveTimer.endTime = getDate();
    await this.timerRepository.save(isActiveTimer);

    await this.studentRepository.update({ id: user.id }, { isStudy: false });

    return isActiveTimer;
  }

  public async getToday(id: string) {
    const resetTime =
      getDate().getHours() < 5
        ? getDate(getDate().setHours(-19, 0, 0, 0))
        : getDate(getDate().setHours(5, 0, 0, 0));
    // const tomorrowResetTime = getDate(getDate().setHours(29, 0, 0, 0));

    const timer = await this.timerRepository
      .createQueryBuilder('timer')
      .where('timer.studentId = :studentId', { studentId: id })
      .andWhere('timer.endTime >= :endTime OR timer.endTime IS NULL', {
        endTime: resetTime,
      })
      .orderBy('timer.startTime', 'ASC')
      .getMany();

    let totalTime = 0;

    timer.forEach((t, index) => {
      if (index === 0) {
        totalTime +=
          getDate((t.endTime ?? getDate()).getTime()).getTime() -
          (t.startTime.getTime() < resetTime.getTime()
            ? resetTime.getTime()
            : t.startTime.getTime());
      } else {
        totalTime += (t.endTime ?? getDate()).getTime() - t.startTime.getTime();
      }
    });

    return {
      timer,
      totalTime,
    };
  }

  public async getStudyTimeByDate(id: string, date: Date) {
    const resetTime = getDate(date.setHours(5, 0, 0, 0));
    const tomorrowResetTime = getDate(date.setHours(29, 0, 0, 0));

    const timer = await this.timerRepository
      .createQueryBuilder('timer')
      .where('timer.studentId = :studentId', { studentId: id })
      .andWhere('timer.endTime >= :endTime OR timer.endTime IS NULL', {
        endTime: resetTime,
      })
      .orderBy('timer.startTime', 'ASC')
      .getMany();

    let totalTime = 0;

    timer.forEach((t, index) => {
      if (index === 0) {
        totalTime +=
          getDate((t.endTime ?? getDate()).getTime()).getTime() -
          (t.startTime < resetTime
            ? resetTime.getTime()
            : t.startTime.getTime());
      } else if (index === timer.length - 1) {
        totalTime +=
          t.endTime > tomorrowResetTime
            ? tomorrowResetTime.getTime()
            : (t.endTime ?? getDate()).getTime() - t.startTime.getTime();
      } else {
        totalTime += (t.endTime ?? getDate()).getTime() - t.startTime.getTime();
      }
    });

    return {
      timer,
      totalTime,
    };
  }

  public async getTotal(id: string) {
    const timers = await this.timerRepository.find({
      select: ['startTime', 'endTime'],
      where: { student: { id } },
      order: { startTime: 'ASC' },
    });

    let totalTime = 0;

    timers.forEach((t) => {
      totalTime += (t.endTime ?? getDate()).getTime() - t.startTime.getTime();
    });

    return {
      timers,
      totalTime,
    };
  }

  public async getWeekById(id: string) {
    const weekStartDay = getDate(getDate().setDate(getDate().getDate() - 7));

    const timers = await this.timerRepository.find({
      select: ['startTime', 'endTime'],
      where: { student: { id } },
      order: { startTime: 'ASC' },
    });
  }
}
