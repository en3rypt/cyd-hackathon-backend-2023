import { SharedModule } from './shared';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
// import { GetAggregateModule } from './get-aggregate/get-aggregate.module';

@Module({
  imports: [SharedModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
