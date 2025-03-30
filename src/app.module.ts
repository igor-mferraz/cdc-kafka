import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import AppDataSource from 'typeorm.config';
import { KafkaConsumerController } from './kafka/kafka.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
  ],

  controllers: [AppController, KafkaConsumerController],
  providers: [AppService]
})
export class AppModule {}
