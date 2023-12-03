import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Group } from 'src/shared/entities/group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  public async findOne({ grade, class: _class }: Express.User) {
    const group = await this.groupRepository.findOne({
      relations: ['teacher', 'students'],
      where: {
        teacher: {
          grade,
          class: _class,
        },
      },
    });
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    return group;
  }
}
