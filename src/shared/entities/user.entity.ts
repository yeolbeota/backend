import { Department } from 'src/constants/department';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { Timer } from './timer.entity';

export enum StudentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class Admin extends BaseEntity {
  @PrimaryColumn()
  email!: string;

  @Column('tinyint')
  grade!: number;

  @Column('tinyint')
  class!: number;

  @CreateDateColumn()
  createdAt!: Date;
}

export class BaseUser extends BaseEntity {
  /**
   * Google ID
   */
  @PrimaryColumn({ length: 32 })
  id!: string;

  /**
   * Google Email
   */
  @Column({ length: 255, unique: true })
  email!: string;

  /**
   * Google Username
   */
  @Column('varchar', { length: 10 })
  username!: string;

  @Column('tinyint')
  grade!: number;

  @Column('tinyint')
  class!: number;

  @Column({ length: 1024 })
  profileImage!: string;

  @Column({ default: 0 })
  fine!: number;

  @Column({ default: false })
  fineStatus!: boolean;

  @Column({ length: 200, nullable: true, select: false })
  refreshToken?: string;

  @Column('enum', { enum: StudentStatus, default: StudentStatus.PENDING })
  status!: StudentStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity()
export class StudentUser extends BaseUser {
  @Column('enum', { enum: Department })
  department!: Department;

  @Column('tinyint')
  number!: number;

  @Column('boolean', { default: false })
  isStudy!: boolean;

  @ManyToOne(() => Group, (group) => group.students)
  group!: Group;

  @OneToMany(() => Timer, (timer) => timer.student, { eager: true })
  timers!: Timer[];
}

@Entity()
export class TeacherUser extends BaseUser {
  @OneToOne(() => Group, (group) => group.teacher, {
    onDelete: 'CASCADE',
  })
  group!: Group;
}
