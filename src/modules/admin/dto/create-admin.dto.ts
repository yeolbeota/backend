import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The email of the user',
    type: String,
  })
  @IsString()
  email!: string;

  @ApiProperty({
    description: 'The grade of the user',
    type: Number,
  })
  @IsNumber()
  grade!: number;

  @ApiProperty({
    description: 'The class of the user',
    type: Number,
  })
  @IsNumber()
  class!: number;
}
