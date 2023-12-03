import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Repository } from 'typeorm';
import { Admin, TeacherUser } from 'src/shared/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(TeacherUser)
    private readonly teacherRepository: Repository<TeacherUser>,
  ) {}

  public async create(createAdminDto: CreateAdminDto) {
    const user = await this.adminRepository.findOneBy({
      email: createAdminDto.email,
    });

    const adminUser = await this.teacherRepository.findOneBy({
      email: createAdminDto.email,
    });

    if (user || adminUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const admin = this.adminRepository.create(createAdminDto);
    await this.adminRepository.save(admin);

    return user;
  }

  public async validateAdmin(id: string) {
    const user = await this.teacherRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return user;
  }
}
