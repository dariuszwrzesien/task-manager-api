import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Task } from './tasks/task.entity';
import { User } from './auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'task-manager',
      autoLoadEntities: true,
      // Setting `synchronize: true` shouldn't be used in production - otherwise you can lose production data.
      // Source: https://docs.nestjs.com/techniques/database
      synchronize: true,
      entities: [User, Task],
    }),
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
