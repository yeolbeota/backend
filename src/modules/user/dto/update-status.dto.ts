import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StudentStatus } from 'src/shared/entities/user.entity';

export class UpdateStatusDto {
  @ApiProperty({
    type: 'enum',
    enum: StudentStatus,
    description: '학생의 상태를 변경합니다.',
  })
  @IsEnum(StudentStatus)
  status!: StudentStatus;
}
