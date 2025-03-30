import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DebeziumEnvelope } from './typeDebezium';

@Controller()
export class KafkaConsumerController {
  @MessagePattern('cdc-using-debezium-topic.public.clientes')
  handleMessage(data: DebeziumEnvelope<any>) {
    console.log('Mensagem recebida:', data.payload);
    // Processa a mensagem
  }
}
