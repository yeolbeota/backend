import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentUser } from 'src/shared/entities/user.entity';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(StudentUser)
    private readonly userRepository: Repository<StudentUser>,
  ) {}

  public async findAll() {
    return await this.userRepository.find();
  }

  public async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update({ id }, updateUserDto);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async remove(id: string) {
    return await this.userRepository.delete({ id });
  }

  public async updateStatus(id: string, { status }: UpdateStatusDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.status = status;
    await this.userRepository.save(user);
    return user;
  }
}
