import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginResponseDto } from '../common/dto/auth/login-response.dto';
import { User } from '../resources/users/entities/user.entity';
import { UsersService } from '../resources/users/users.service';

/**
 * Service for handling authentication logic.
 */
@Injectable()
export class AuthService {
  /**
   * Constructor for AuthService.
   *
   * @param {UsersService} usersService - The service to manage user data.
   * @param {JwtService} jwtService - The service to handle JWT operations.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates the user credentials.
   *
   * @param {string} username - The username of the user.
   * @param {string} plainPassword - The plain text password of the user.
   * @returns {Promise<User>} - A promise that resolves to the user if credentials are valid.
   */
  async validateUser(username: string, plainPassword: string): Promise<User> {
    const user: User = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid login credentials.');

    const isPasswordValid: boolean = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login credentials.');
    }

    return user;
  }

  /**
   * Generates a JWT token for the user.
   *
   * @param {User} user - The user object containing user details.
   * @returns {Promise<LoginResponseDto>} - The login response containing the JWT access token and user details.
   */
  async login(user: User): Promise<LoginResponseDto> {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    await this.usersService.setLastLogin(user.id, new Date());

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
