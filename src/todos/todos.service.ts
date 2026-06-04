import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private readonly db: DatabaseService) {}

  // Create
  async create(title: string, description?: string): Promise<Todo> {
    return this.db.todo.create({
      data: {
        title,
        description: description || null,
      },
    });
  }

  // Read (All)
  async findAll(): Promise<Todo[]> {
    return this.db.todo.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  // Read (One)
  async findOne(id: number): Promise<Todo> {
    const todo = await this.db.todo.findUnique({
      where: { id },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  // Update
  async update(id: number, title?: string, description?: string, isCompleted?: boolean): Promise<Todo> {
    // Kiểm tra tồn tại
    await this.findOne(id);

    return this.db.todo.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        isCompleted: isCompleted !== undefined ? isCompleted : undefined,
      },
    });
  }

  // Delete
  async remove(id: number): Promise<{ message: string }> {
    // Kiểm tra tồn tại
    await this.findOne(id);

    await this.db.todo.delete({
      where: { id },
    });
    
    return { message: `Todo with ID ${id} has been deleted successfully` };
  }
}
