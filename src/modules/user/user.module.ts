import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentUser } from 'src/shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentUser])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
