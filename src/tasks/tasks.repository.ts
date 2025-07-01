import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private readonly logger = new Logger(TasksRepository.name, {
    timestamp: true,
  });

  constructor(private readonly dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    // Join with user to filter tasks by user
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '((LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)))',
        { search: `%${search}%` },
      );
    }

    try {
      return query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}" with filters: ${JSON.stringify(filterDto)}`,
      );
      throw error; // Re-throw the error after logging it
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    try {
      const savedTask = await this.save(task);
      this.logger.debug(
        `Task created successfully: ${JSON.stringify(savedTask)}`,
      );
      // Return the saved task
      return savedTask;
    } catch (error) {
      this.logger.error(
        `Failed to create task for user "${user.username}". Data: ${JSON.stringify(createTaskDto)}`,
      );
      throw error; // Re-throw the error after logging it
    }

    this.logger.log(
      `Task with ID "${task.id}" created for user "${user.username}"`,
    );
  }
}
