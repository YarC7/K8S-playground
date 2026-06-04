import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // Định nghĩa Global để các module khác import trực tiếp sử dụng không cần khai báo lại
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
