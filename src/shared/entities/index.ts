import { StudentUser, TeacherUser, Admin } from './user.entity';
import { Group } from './group.entity';
import { Timer } from './timer.entity';

export * as User from './user.entity';
export * as Group from './group.entity';
export * as Timer from './timer.entity';

export default [StudentUser, TeacherUser, Admin, Group, Timer];
