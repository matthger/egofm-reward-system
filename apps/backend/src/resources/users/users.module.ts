import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Level } from '../level/entities/level.entity';

/**
 * UsersModule is responsible for managing user-related functionality.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Level, User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
