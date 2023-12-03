import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminStrategy } from './strategies/admin.strategy';
import { Admin, TeacherUser } from 'src/shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, TeacherUser])],
  controllers: [AdminController],
  providers: [AdminService, AdminStrategy],
})
export class AdminModule {}
