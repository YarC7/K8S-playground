import {
  Controller,
  Get,
  Param,
  Query,
  Headers,
  HttpException,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { faker } from '@faker-js/faker';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiHeader, ApiResponse } from '@nestjs/swagger';

@ApiTags('Simulations')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. GET: Default Hello World (Trạng thái 200, siêu nhanh)
  @Get()
  @ApiOperation({ summary: 'Default Hello World API' })
  getHello(): string {
    return this.appService.getHello();
  }

  // 2. GET: Giả lập delay/độ trễ (status 200, thích hợp test timeout)
  @Get('delay/:ms')
  @ApiOperation({ summary: 'Giả lập delay/độ trễ phản hồi (test latency/timeout)' })
  @ApiParam({ name: 'ms', description: 'Số mili giây muốn làm trễ', example: '500' })
  async getDelay(@Param('ms') ms: string) {
    const delayMs = parseInt(ms, 10) || 100;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return {
      message: `Delayed response`,
      delayMs,
      timestamp: Date.now(),
    };
  }

  // 3. GET: Giả lập mã lỗi HTTP (400, 401, 403, 404, 500, v.v.)
  @Get('error/:code')
  @ApiOperation({ summary: 'Giả lập mã lỗi HTTP phản hồi (test HTTP errors)' })
  @ApiParam({ name: 'code', description: 'Mã HTTP status code mong muốn (400-599)', example: '500' })
  getError(@Param('code') code: string) {
    const statusCode = parseInt(code, 10) || 500;
    if (statusCode >= 400 && statusCode < 600) {
      throw new HttpException(`Simulated ${statusCode} error`, statusCode);
    }
    return { message: 'No error occurred', statusCode };
  }

  // 4. GET: Test query parameters (Ví dụ: /query-test?limit=10&page=2)
  @Get('query-test')
  @ApiOperation({ summary: 'Test xử lý query parameters' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'page', required: false, example: '2' })
  getQueryTest(@Query() query: any) {
    return {
      message: 'Query parameters processed',
      query,
    };
  }

  // 5. GET: Trả về headers mà client gửi lên
  @Get('headers-test')
  @ApiOperation({ summary: 'Trả về toàn bộ headers client gửi lên' })
  getHeadersTest(@Headers() headers: any) {
    return {
      message: 'Headers received',
      headers,
    };
  }

  // 6. GET: Giả lập dung lượng response lớn (test băng thông, đơn vị KB)
  @Get('response-size/:kb')
  @ApiOperation({ summary: 'Giả lập dung lượng response lớn (test network throughput/bandwidth)' })
  @ApiParam({ name: 'kb', description: 'Dung lượng payload mong muốn tính bằng KB', example: '100' })
  getResponseSize(@Param('kb') kb: string) {
    const sizeKb = parseInt(kb, 10) || 1;
    const data = 'A'.repeat(sizeKb * 1024);
    return {
      message: `Generated ${sizeKb} KB payload`,
      sizeKb,
      data,
    };
  }

  // 7. GET: Tác vụ tốn CPU (Tính số Fibonacci - test tải CPU và blocking event loop)
  @Get('cpu-intensive')
  @ApiOperation({ summary: 'Chạy tác vụ tốn CPU (Tính số Fibonacci - test CPU utilization)' })
  @ApiQuery({ name: 'n', description: 'Số n trong chuỗi Fibonacci (khuyên dùng 30-40 để tránh đơ server)', required: false, example: '35' })
  getCpuIntensive(@Query('n') nStr?: string) {
    const n = parseInt(nStr || '35', 10);
    const start = Date.now();
    
    const fib = (num: number): number => {
      if (num <= 1) return num;
      return fib(num - 1) + fib(num - 2);
    };
    
    const result = fib(n);
    const duration = Date.now() - start;
    
    return {
      message: 'CPU heavy task completed',
      fibonacciInput: n,
      result,
      durationMs: duration,
    };
  }

  // 8. GET: Giả lập Redirect (302) sang trang khác
  @Get('redirect')
  @ApiOperation({ summary: 'Giả lập phản hồi chuyển hướng (302 Redirect)' })
  @Redirect('https://nestjs.com', 302)
  getRedirect() {
    return { url: 'https://nestjs.com' };
  }

  // 9. GET: Sinh số ngẫu nhiên & thông tin tài chính giả lập
  @Get('finance-simulation')
  @ApiOperation({ summary: 'Sinh thông tin tài chính giả lập (Faker)' })
  getFinanceSimulation() {
    return {
      transactionId: faker.string.uuid(),
      amount: faker.finance.amount({ min: 10, max: 1000, dec: 2 }),
      currency: faker.finance.currencyCode(),
      iban: faker.finance.iban(),
      creditCardNumber: faker.finance.creditCardNumber(),
      timestamp: Date.now(),
    };
  }

  // 10. GET: Sinh thông tin người dùng giả lập
  @Get('users/random')
  @ApiOperation({ summary: 'Sinh thông tin người dùng ngẫu nhiên giả lập (Faker)' })
  getRandomUser() {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      phone: faker.phone.number(),
      jobTitle: faker.person.jobTitle(),
      bio: faker.person.bio(),
    };
  }

  // 11. GET: Giả lập lấy chi tiết sản phẩm theo ID bằng faker
  @Get('items/:id')
  @ApiOperation({ summary: 'Giả lập xem chi tiết sản phẩm theo ID (Faker)' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm', example: 'prod_99' })
  getItemDetail(@Param('id') id: string) {
    return {
      id,
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      department: faker.commerce.department(),
      material: faker.commerce.productMaterial(),
      imageUrl: faker.image.urlLoremFlickr({ category: 'technics' }),
      available: faker.datatype.boolean(0.8),
    };
  }

  // 12. GET: Giả lập API danh sách items với faker
  @Get('list-items')
  @ApiOperation({ summary: 'Giả lập lấy danh sách bài đăng (Faker)' })
  @ApiQuery({ name: 'count', description: 'Số lượng phần tử muốn lấy', required: false, example: '5' })
  getListItems(@Query('count') countStr?: string) {
    const count = Math.min(parseInt(countStr || '5', 10), 100);
    const items = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      uuid: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      author: faker.person.fullName(),
      createdAt: faker.date.recent().toISOString(),
    }));
    return {
      count,
      items,
    };
  }

  // 13. GET: Mô phỏng xác thực qua headers Authorization
  @Get('auth-simulation')
  @ApiOperation({ summary: 'Mô phỏng xác thực (yêu cầu gửi header Authorization)' })
  @ApiHeader({ name: 'authorization', description: 'Mã token xác thực (ví dụ: Bearer token123)', required: true })
  @ApiResponse({ status: 200, description: 'Xác thực thành công.' })
  @ApiResponse({ status: 401, description: 'Thiếu token xác thực.' })
  getAuthSimulation(@Headers('authorization') auth?: string) {
    if (!auth) {
      throw new HttpException('Missing authorization token', 401);
    }
    return {
      authenticated: true,
      tokenPreview: auth.substring(0, 10) + '...',
      user: {
        id: faker.string.uuid(),
        role: faker.helpers.arrayElement(['admin', 'user', 'manager']),
        email: faker.internet.email(),
      },
    };
  }

  // 14. GET: Mô phỏng thông tin thời tiết
  @Get('weather-simulation')
  @ApiOperation({ summary: 'Giả lập thông tin thời tiết (Faker)' })
  @ApiQuery({ name: 'city', description: 'Tên thành phố', required: false, example: 'Hanoi' })
  getWeatherSimulation(@Query('city') cityQuery?: string) {
    const city = cityQuery || faker.location.city();
    return {
      city,
      country: faker.location.country(),
      temperature: faker.number.int({ min: -10, max: 45 }),
      humidity: faker.number.int({ min: 10, max: 100 }),
      windSpeed: faker.number.float({ min: 0, max: 30, fractionDigits: 1 }),
      condition: faker.helpers.arrayElement(['Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Windy', 'Stormy']),
      forecast: Array.from({ length: 3 }, (_, i) => ({
        day: i + 1,
        temperature: faker.number.int({ min: -10, max: 45 }),
        condition: faker.helpers.arrayElement(['Sunny', 'Rainy', 'Cloudy']),
      })),
      timestamp: Date.now(),
    };
  }

  // 15. GET: Mô phỏng thông tin công ty và địa chỉ doanh nghiệp
  @Get('company-simulation')
  @ApiOperation({ summary: 'Giả lập thông tin công ty và địa chỉ (Faker)' })
  getCompanySimulation() {
    return {
      name: faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
      buzz: faker.company.buzzPhrase(),
      employeeCount: faker.number.int({ min: 5, max: 10000 }),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
        coordinates: {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        },
      },
    };
  }

  // 16. GET: Mô phỏng thông tin xe cộ/phương tiện giao thông
  @Get('vehicle-simulation')
  @ApiOperation({ summary: 'Giả lập thông tin phương tiện giao thông (Faker)' })
  getVehicleSimulation() {
    return {
      manufacturer: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      type: faker.vehicle.type(),
      fuel: faker.vehicle.fuel(),
      vin: faker.vehicle.vin(),
      color: faker.vehicle.color(),
      licensePlate: faker.vehicle.vrm(),
    };
  }

  // 17. GET: Mô phỏng một bài đăng mạng xã hội (Social Media Post)
  @Get('posts-simulation')
  @ApiOperation({ summary: 'Giả lập bài đăng mạng xã hội (Faker)' })
  getPostsSimulation() {
    return {
      postId: faker.string.uuid(),
      caption: faker.lorem.paragraph(),
      tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.lorem.word()),
      likes: faker.number.int({ min: 0, max: 15000 }),
      shares: faker.number.int({ min: 0, max: 5000 }),
      commentsCount: faker.number.int({ min: 0, max: 1000 }),
      author: {
        username: faker.internet.username(),
        avatar: faker.image.avatar(),
        isVerified: faker.datatype.boolean(0.2),
      },
      topComments: Array.from({ length: 2 }, () => ({
        commentId: faker.string.uuid(),
        user: faker.internet.username(),
        text: faker.lorem.sentence(),
        likes: faker.number.int({ min: 0, max: 500 }),
      })),
      postedAt: faker.date.past().toISOString(),
    };
  }
}
