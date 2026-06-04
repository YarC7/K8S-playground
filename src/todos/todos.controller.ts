import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from '@prisma/client';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ description: 'Tiêu đề của công việc cần làm', example: 'Học Kubernetes' })
  title: string;

  @ApiProperty({ description: 'Mô tả chi tiết công việc', example: 'Cấu hình cluster và cài pgbouncer', required: false })
  description?: string;
}

export class UpdateTodoDto {
  @ApiProperty({ description: 'Tiêu đề mới của công việc', example: 'Học Docker', required: false })
  title?: string;

  @ApiProperty({ description: 'Mô tả mới', example: 'Thiết kế multi-stage build', required: false })
  description?: string;

  @ApiProperty({ description: 'Trạng thái hoàn thành', example: true, required: false })
  isCompleted?: boolean;
}

@ApiTags('Todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo một công việc Todo mới' })
  @ApiResponse({ status: 201, description: 'Tạo thành công.' })
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto.title, createTodoDto.description);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách công việc' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công.' })
  findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một công việc theo ID' })
  @ApiResponse({ status: 200, description: 'Tìm thấy công việc.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy công việc.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin công việc theo ID' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy công việc.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(
      id,
      updateTodoDto.title,
      updateTodoDto.description,
      updateTodoDto.isCompleted,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một công việc theo ID' })
  @ApiResponse({ status: 200, description: 'Xóa thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy công việc.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.todosService.remove(id);
  }
}
