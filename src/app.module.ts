import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Task } from './tasks/task.entity';
import { User } from './auth/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          ssl: isProduction,
          extra: isProduction
            ? {
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {},
          // Database connection options
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          // Setting `synchronize: true` shouldn't be used in production - otherwise you can lose production data.
          // Source: https://docs.nestjs.com/techniques/database
          synchronize: isProduction ? false : true,
          entities: [User, Task],
        };
      },
    }),
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
