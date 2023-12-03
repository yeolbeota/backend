import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BaseUser,
  StudentUser,
  TeacherUser,
} from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(StudentUser)
    private readonly studentRepository: Repository<StudentUser>,
    @InjectRepository(TeacherUser)
    private readonly teacherRepository: Repository<StudentUser>,
  ) {}

  public async isUserExistByEmail(email: string): Promise<boolean> {
    return !!(await this.studentRepository.findOneBy({ email }));
  }

  public async isUserExistById(id: string) {
    const studentUser = await this.studentRepository.findOneBy({ id });
    if (studentUser) return studentUser;

    const teacherUser = await this.teacherRepository.findOneBy({ id });
    if (teacherUser) return teacherUser;

    return false;
  }

  public async generateRefreshToken(
    user: Pick<BaseUser, 'id'>,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );

    if (user instanceof StudentUser) {
      await this.studentRepository.update(
        { id: user.id },
        { refreshToken: token },
      );
    }

    if (user instanceof TeacherUser) {
      await this.teacherRepository.update(
        { id: user.id },
        { refreshToken: token },
      );
    }

    return token;
  }

  public async validateRefreshToken(userId: string, refreshToken: string) {
    try {
      let user = await this.studentRepository.findOne({
        where: { id: userId },
        select: ['id', 'refreshToken'],
      });

      if (!user) {
        user = await this.teacherRepository.findOne({
          where: { id: userId },
          select: ['id', 'refreshToken'],
        });
      }

      const token = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      if (!user || !token) {
        return false;
      }

      return (
        token.id === user.id && refreshToken === user.refreshToken && user.id
      );
    } catch {
      return false;
    }
  }

  public async generateAccessToken(
    user: Pick<BaseUser, 'id'>,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
      },
    );
  }

  public async validateAccessToken(
    userId: string,
    accessToken: string,
  ): Promise<boolean> {
    try {
      const { id } = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
      return id === userId;
    } catch {
      return false;
    }
  }

  public async deleteRefreshToken(userId: string): Promise<void> {
    await this.studentRepository.update({ id: userId }, { refreshToken: '' });
    await this.teacherRepository.update({ id: userId }, { refreshToken: '' });
  }
}
