import { ApiProperty } from '@nestjs/swagger';

import { LoginResponse } from '@egofm-reward/shared';

import { UserDetailsDto } from '../user/user-details.dto';

/**
 * Login Response Data Transfer Object (DTO) for user authentication.
 */
export class LoginResponseDto implements LoginResponse {
  @ApiProperty({
    description: 'JWT Access Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: { id: '9b3f94ae-0c72-4a5a-83b8-01cc2c9122a3', username: 'listener', role: 'user' },
  })
  user: Partial<UserDetailsDto>;
}
