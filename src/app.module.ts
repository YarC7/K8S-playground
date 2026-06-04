import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicController } from './public.controller';

@Module({
  imports: [],
  controllers: [AppController, PublicController],
  providers: [AppService],
})
export class AppModule {}
