import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  // http://localhost:3000/tasks/123
  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<DeleteResult> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto.status);
  }

  //   // getTaskById(@Param('id') id: string): Task {
  //   //   return this.tasksService.getTaskById(id);
  //   // }

  //   // @Get()
  //   // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   //   if (Object.keys(filterDto).length) {
  //   //     return this.tasksService.getTasksWithFilters(filterDto);
  //   //   } else {
  //   //     return this.tasksService.getAllTasks();
  //   //   }
  //   // }

  //   // @Post()
  //   // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //   //   return this.tasksService.createTask(createTaskDto);
  //   // }

  //   // @Delete('/:id')
  //   // deleteTask(@Param('id') id: string): void {
  //   //   this.tasksService.deleteTask(id);
  //   // }

  //   // @Patch('/:id/status')
  //   // updateTask(
  //   //   @Param('id') id: string,
  //   //   @Body() updateTaskDto: UpdateTaskDto,
  //   // ): Task {
  //   //   return this.tasksService.updateTask(id, updateTaskDto.status);
  //   // }
  // }
}
