// kafka.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaClientesModule } from './clientes/kafka-clientes.module';// import { KafkaService } from './kafka.service';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: { brokers: ['localhost:9092'] },
          consumer: { groupId: '2ae58897-4ba7-4fe9-a232-1984997e343a' },
        },
      },
    ]),
    KafkaClientesModule,
    UsersModule,
  ],
})
export class KafkaModule {}
