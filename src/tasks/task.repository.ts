import { DeleteResult, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    const result = await this.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} Not found`);
    }

    return result;
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} Not found`);
    }

    task.status = status;
    await this.save(task);
    return task;
  }
}
