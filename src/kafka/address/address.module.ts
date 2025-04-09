import { Module } from "@nestjs/common";
import { KafkaAddressConsumerController } from "./address.controller";
import { AddressKafkaService } from "./address.service";
import { AddressModule } from "src/address/address.module";
import { UsersModule } from "src/users/users.module";

@Module({
    controllers: [KafkaAddressConsumerController],
    providers: [AddressKafkaService],
    imports: [AddressModule, UsersModule],
})

export class KafkaAddressModule {}