import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentUser, TeacherUser } from './user.entity';

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => TeacherUser, (teacher) => teacher.group)
  @JoinColumn()
  teacher!: TeacherUser;

  @OneToMany(() => StudentUser, (student) => student.group)
  @JoinColumn()
  students!: StudentUser[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
