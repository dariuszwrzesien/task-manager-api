import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateTask(id: string, updateData: Partial<Task>): Promise<Task> {
    const task = await this.getTaskById(id);
    const updatedTask = { ...task, ...updateData };

    return this.tasksRepository.update(id, updatedTask).then(() => updatedTask);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;

    return this.tasksRepository.update(id, task).then(() => task);
  }

  async deleteTask(id: string): Promise<void> {
    // Prefer using the repository's delete method because it will be only one database call
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Alternatively, you can use the following code to remove the task:
    // const task = await this.getTaskById(id);
    // await this.tasksRepository.remove(task);
  }
}
