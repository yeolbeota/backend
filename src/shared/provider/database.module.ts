import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import entities from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        database: config.get<string>('DB_NAME'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        entities: entities,
        migrations: [],
        subscribers: [],
        synchronize: true,
        charset: 'utf8_general_ci',
        timezone: 'Asia/Seoul',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
