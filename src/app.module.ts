import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { validate } from 'src/common/utils/env-validation';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, expandVariables: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...dataSourceOptions,
      }),
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
