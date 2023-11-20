// export class UserDto {
//   id!: string;

import { User } from 'src/shared/entities/user.entity';

// }
export type UserDto = Pick<User, 'id'>;
