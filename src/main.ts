import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // Usa a porta mapeada pelo docker-compose
      },
      consumer: {
        groupId: '2ae58897-4ba7-4fe9-a232-1984997e343a', // Altere conforme necessário
      },
    },
  });
  await app.listen();
  console.log('Consumer Kafka rodando...');
}

bootstrap();
