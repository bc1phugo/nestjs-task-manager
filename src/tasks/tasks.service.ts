import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { DeleteResult } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} Not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasksWithFilters(filterDto);
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    return this.taskRepository.deleteTask(id);
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    return this.taskRepository.updateTask(id, status);
  }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }

  //   return tasks;
  // }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);

  //   if (!found) {
  //     throw new NotFoundException(`Task with ID ${id} Not found`);
  //   }

  //   return found;
  // }

  // deleteTask(id: string): void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }

  // updateTask(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   if (task) {
  //     task.status = status;
  //   }

  //   return task;
  // }
}
