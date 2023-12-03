import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pattern, Util } from 'src/constants';
import { getDepartmentByClass } from 'src/constants/department';
import {
  Admin,
  StudentStatus,
  StudentUser,
  TeacherUser,
} from 'src/shared/entities/user.entity';
import { Group } from 'src/shared/entities/group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    public readonly config: ConfigService,
    @InjectRepository(StudentUser)
    private readonly studentRepository: Repository<StudentUser>,
    @InjectRepository(TeacherUser)
    private readonly teacherRepository: Repository<TeacherUser>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const id = profile.id;
      let { familyName, givenName } = profile.name;
      const email = profile.emails[0].value;

      if (Pattern.SUNRIN_STUDENT_EMAIL_PATTERN.test(email)) {
        const user = await this.studentRepository.findOneBy({ id });
        if (user) {
          return done(null, user);
        }

        if (Util.isNumeric(familyName))
          givenName = [familyName, (familyName = givenName)][0];
        const userClass = parseInt(givenName.substring(1, 3));
        const userGrade = parseInt(givenName.substring(0, 1));

        const group = await this.groupRepository
          .createQueryBuilder('group')
          .leftJoinAndSelect('group.teacher', 'teacher')
          .where('teacher.grade = :grade', { grade: userGrade })
          .andWhere('teacher.class = :class', { class: userClass })
          .getOne();

        if (!group) {
          return done(null, undefined, { reason: 'Unauthorized' });
        }

        const newUser = await this.studentRepository.save({
          id,
          email,
          username: familyName,
          department: getDepartmentByClass(userClass),
          grade: userGrade,
          class: userClass,
          number: +givenName.substring(3, 5),
          group,
          profileImage: profile.photos[0].value,
        });

        return done(null, newUser);
      } else if (Pattern.SUNRIN_EMAIL_PATTERN.test(email)) {
        const teacherUser = await this.teacherRepository.findOneBy({ id });
        if (teacherUser) {
          return done(null, teacherUser);
        }

        const adminUser = await this.adminRepository.findOneBy({ email });
        if (!adminUser) {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }

        const newUser = this.teacherRepository.create({
          id,
          email,
          username: familyName,
          grade: adminUser.grade,
          class: adminUser.class,
          status: StudentStatus.APPROVED,
          profileImage: profile.photos[0].value,
        });

        await this.teacherRepository.save(newUser);

        await this.groupRepository.save({
          teacher: newUser,
          students: [],
        });

        await this.adminRepository.delete({ email });

        return done(null, newUser);
      }
      return done(null, undefined, { reason: 'Unauthorized' });
    } catch (err) {
      console.error(err);
      return done(null, undefined, { reason: 'Unauthorized' });
    }
  }
}
