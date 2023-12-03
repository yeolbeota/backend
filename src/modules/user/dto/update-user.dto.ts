import { PartialType } from '@nestjs/swagger';
import { StudentUser } from 'src/shared/entities/user.entity';

export class UpdateUserDto extends PartialType(StudentUser) {}
