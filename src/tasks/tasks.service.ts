import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

//Business logic for tasks management

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id, user });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async updateTask(
    id: string,
    updateData: Partial<Task>,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    const updatedTask = { ...task, ...updateData };

    return this.tasksRepository.update(id, updatedTask).then(() => updatedTask);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    return this.tasksRepository.update(id, task).then(() => task);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    // Prefer using the repository's delete method because it will be only one database call
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Alternatively, you can use the following code to remove the task:
    // const task = await this.getTaskById(id, user);
    // await this.tasksRepository.remove(task);
  }
}
