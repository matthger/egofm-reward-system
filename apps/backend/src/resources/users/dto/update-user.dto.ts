import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

import { UpdateUser } from '@egofm-reward/shared';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO for updating an existing user.
 * Inherits all properties from CreateUserDto but makes them optional.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) implements UpdateUser {
  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'StrongPassword123', required: false })
  oldPassword?: string;
}
