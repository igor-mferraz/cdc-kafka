import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DebeziumEnvelope } from '../typeDebezium';
import { ClienteKafkaService } from './kafka-clientes.service';

@Controller()
export class KafkaConsumerController {

  constructor(private readonly clienteKafkaService: ClienteKafkaService) {}

  @MessagePattern('cdc.C__DEBEZIUM_USER.USERS')
  handleMessage(data: DebeziumEnvelope<any>) {
    this.clienteKafkaService.processMessage(data);
  }
  
}
