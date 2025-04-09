import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import AppDataSource from 'typeorm.config';
import { KafkaModule } from './kafka/kafka.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    KafkaModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
