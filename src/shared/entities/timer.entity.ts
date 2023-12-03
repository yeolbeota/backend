import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentUser } from './user.entity';

@Entity()
export class Timer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => StudentUser, (user) => user.timers)
  student!: StudentUser;

  @CreateDateColumn()
  startTime!: Date;

  @Column({ nullable: true })
  endTime!: Date;
}
