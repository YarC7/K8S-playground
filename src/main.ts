import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình Swagger UI
  const config = new DocumentBuilder()
    .setTitle('NestJS Todo API')
    .setDescription('Tài liệu hướng dẫn sử dụng API Todo List và Test traffic')
    .setVersion('1.0')
    .addTag('Todos', 'Các API quản lý danh sách công việc')
    .addTag('Simulations', 'Các API giả lập dữ liệu test traffic')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
