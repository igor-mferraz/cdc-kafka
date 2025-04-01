import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DebeziumEnvelope } from '../typeDebezium';
import { ClienteKafkaService } from './kafka-clientes.service';

@Controller()
export class KafkaConsumerController {

  constructor(private readonly clienteKafkaService: ClienteKafkaService) {}

  @MessagePattern('oracle-source-cdc.system.clientes')
  handleMessage(data: DebeziumEnvelope<any>) {
    console.log('data', data);
    this.clienteKafkaService.processMessage(data);
  }
  
}
