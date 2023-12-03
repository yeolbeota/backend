import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Admin,
  StudentUser,
  TeacherUser,
} from 'src/shared/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessStrategy } from './strategies/access.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { Group } from 'src/shared/entities/group.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secretOrPrivateKey: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
      }),
    }),
    TypeOrmModule.forFeature([StudentUser, TeacherUser, Admin, Group]),
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthService,
    GoogleStrategy,
    RefreshStrategy,
    AccessStrategy,
  ],
})
export class AuthModule {}
