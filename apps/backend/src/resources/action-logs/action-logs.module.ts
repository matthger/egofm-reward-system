import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionLogsController } from './action-logs.controller';
import { ActionLogsService } from './action-logs.service';
import { ActionLog } from './entities/action-log.entity';
import { ActionsModule } from '../actions/actions.module';
import { LevelModule } from '../level/level.module';
import { UsersModule } from '../users/users.module';

/**
 * ActionLogsModule is responsible for managing action logs.
 */
@Module({
  imports: [TypeOrmModule.forFeature([ActionLog]), ActionsModule, UsersModule, LevelModule],
  controllers: [ActionLogsController],
  providers: [ActionLogsService],
})
export class ActionLogsModule {}
