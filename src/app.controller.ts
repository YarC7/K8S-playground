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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // 1. GET: Default Hello World (Trạng thái 200, siêu nhanh)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 2. GET: Giả lập delay/độ trễ (status 200, thích hợp test timeout)
  @Get('delay/:ms')
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
  getError(@Param('code') code: string) {
    const statusCode = parseInt(code, 10) || 500;
    if (statusCode >= 400 && statusCode < 600) {
      throw new HttpException(`Simulated ${statusCode} error`, statusCode);
    }
    return { message: 'No error occurred', statusCode };
  }

  // 4. GET: Test query parameters (Ví dụ: /query-test?limit=10&page=2)
  @Get('query-test')
  getQueryTest(@Query() query: any) {
    return {
      message: 'Query parameters processed',
      query,
    };
  }

  // 5. GET: Trả về headers mà client gửi lên
  @Get('headers-test')
  getHeadersTest(@Headers() headers: any) {
    return {
      message: 'Headers received',
      headers,
    };
  }

  // 6. GET: Giả lập dung lượng response lớn (test băng thông, đơn vị KB)
  @Get('response-size/:kb')
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
  @Redirect('https://nestjs.com', 302)
  getRedirect() {
    return { url: 'https://nestjs.com' };
  }

  // 9. GET: Sinh số ngẫu nhiên & thông tin tài chính giả lập
  @Get('finance-simulation')
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

