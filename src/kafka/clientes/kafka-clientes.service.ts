import { Injectable } from "@nestjs/common";
import { DebeziumEnvelope, OperationType } from "../typeDebezium";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ClienteKafkaService {
    constructor(private readonly usersService: UsersService) {}
    async processMessage(data: DebeziumEnvelope<any>) {
        console.log('Mensagem recebida:', data.payload);

        if(data.payload.op == OperationType.CREATE){
            let payload = {
                nome: data.payload.after.nome,
                email: data.payload.after.email,
            };
            const user = this.usersService.create(payload);
            return user;
        }
    }

}
