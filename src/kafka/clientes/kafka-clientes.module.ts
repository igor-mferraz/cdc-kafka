import { Module } from "@nestjs/common";
import { KafkaConsumerController } from "./kafka-clientes.controller";
import { ClienteKafkaService } from "./kafka-clientes.service";
import { UsersModule } from "src/users/users.module";
@Module({
    controllers: [KafkaConsumerController],
    providers: [ClienteKafkaService],
    imports: [UsersModule],
})

export class KafkaClientesModule {}