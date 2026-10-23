import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { LoginResponseDto } from '../common/dto/auth/login-response.dto';
import { LoginDto } from '../common/dto/auth/login.dto';
import { User } from '../resources/users/entities/user.entity';

/**
 * Controller for authentication operations.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  /**
   * Constructor for AuthController.
   *
   * @param {AuthService} authService - The authentication service to handle login logic.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user login with username.
   *
   * @param {LoginDto} loginDto - The login data transfer object containing username and password.
   * @returns {Promise<LoginResponseDto>} - A promise that resolves to the login response containing JWT access token.
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with username' })
  @ApiResponse({ status: 200, description: 'JWT Access Token', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid login credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const user: User = await this.authService.validateUser(loginDto.username, loginDto.password);
    return this.authService.login(user);
  }
}
