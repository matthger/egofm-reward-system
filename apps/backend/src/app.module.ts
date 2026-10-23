import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { WinstonModule } from 'nest-winston';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { HttpLoggingMiddleware } from './config/http-logging.middleware';
import { typeOrmConfig } from './config/typeorm.config';
import { winstonLogger } from './config/winston.config';
import { ActionLogsModule } from './resources/action-logs/action-logs.module';
import { ActionsModule } from './resources/actions/actions.module';
import { LevelModule } from './resources/level/level.module';
import { RewardClaimsModule } from './resources/reward-claims/reward-claims.module';
import { RewardsModule } from './resources/rewards/rewards.module';
import { UsersModule } from './resources/users/users.module';
import { SeederModule } from './seeder/seeder.module';

/**
 * The AppModule is the root module of the application.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    WinstonModule.forRoot({
      instance: winstonLogger,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    UsersModule,
    LevelModule,
    ActionsModule,
    ActionLogsModule,
    RewardsModule,
    RewardClaimsModule,
    SeederModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * Configures the middleware for the application.
   *
   * @param {MiddlewareConsumer} consumer - The middleware consumer to apply the middleware to.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggingMiddleware).forRoutes('*');
  }
}
