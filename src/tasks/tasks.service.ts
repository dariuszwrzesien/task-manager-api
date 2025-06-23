import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  // getAllTasks(): Task[] {
  //   return this.tasksRepository.findAll();
  // }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     const lowerSearch = search.toLowerCase();
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.toLowerCase().includes(lowerSearch) ||
  //         (task.description &&
  //           task.description.toLowerCase().includes(lowerSearch)),
  //     );
  //   }
  //   return tasks;
  // }
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

  // updateTask(id: string, updateData: Partial<Task>): Task {
  //   const taskIndex = this.tasks.findIndex((task) => task.id === id);
  //   if (taskIndex === -1) {
  //     throw new NotFoundException(`Task with ID ${id} not found`);
  //   }
  //   const existingTask = this.tasks[taskIndex];
  //   const updatedTask: Task = {
  //     ...existingTask,
  //     ...updateData,
  //     updatedAt: new Date(),
  //   };
  //   this.tasks[taskIndex] = updatedTask;
  //   return updatedTask;
  // }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   task.updatedAt = new Date();
  //   return task;
  // }
  // deleteTask(id: string): void {
  //   const found = this.getTaskById(id); // This will throw an error if the task is not found
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
}
