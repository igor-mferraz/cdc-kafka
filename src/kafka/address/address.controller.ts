import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DebeziumEnvelope } from '../typeDebezium';
import { AddressKafkaService } from './address.service';


@Controller()
export class KafkaAddressConsumerController {

  constructor(private readonly addressKafkaService: AddressKafkaService) {}

  @MessagePattern('cdc.C__DEBEZIUM_USER.ADDRESS')
  handleMessage(data: DebeziumEnvelope<any>) {
    this.addressKafkaService.processMessage(data);
  }
  
}
