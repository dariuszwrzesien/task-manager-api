import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid'; // Importing uuid for generating unique IDs
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerSearch) ||
          (task.description &&
            task.description.toLowerCase().includes(lowerSearch)),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, updateData: Partial<Task>): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const existingTask = this.tasks[taskIndex];
    const updatedTask: Task = {
      ...existingTask,
      ...updateData,
      updatedAt: new Date(),
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);

    task.status = status;
    task.updatedAt = new Date();

    return task;
  }

  deleteTask(id: string): void {
    const found = this.getTaskById(id); // This will throw an error if the task is not found
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
