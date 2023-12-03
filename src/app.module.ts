import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { DatabaseModule } from './shared/provider/database.module';
import { ConfigValidator } from './validators/config';
import ms from 'ms';
import { GroupModule } from './modules/group/group.module';
import { FineModule } from './modules/fine/fine.module';
import { TimerModule } from './modules/timer/timer.module';
import { RankingModule } from './modules/ranking/ranking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
      validationSchema: ConfigValidator,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        ttl: ms(config.get<string>('CACHE_TTL', '5s')),
        max: config.get<number>('CACHE_MAX', 100),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    AdminModule,
    GroupModule,
    FineModule,
    TimerModule,
    RankingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
