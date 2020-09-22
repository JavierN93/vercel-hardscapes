import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';

import { UserRole } from '../../common/enums/user-role.enum';

export class InviteUserDto {
  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
