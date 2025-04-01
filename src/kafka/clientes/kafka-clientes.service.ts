import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DebeziumEnvelope, OperationType } from "../typeDebezium";
import { UsersService } from "src/users/users.service";

type Payload = {
    ref_id: number;
    nome: string;
    email: string;
}

@Injectable()
export class ClienteKafkaService {
    constructor(private readonly usersService: UsersService) {}
    
    async processMessage(data: DebeziumEnvelope<any>) {
        if(data?.payload?.op){
            if(data.payload.op == OperationType.DELETE){
                await this.delete(data.payload.before.id);
            }
            
            let payload: Payload = {
                ref_id: data.payload.after.id,
                nome: data.payload.after.nome,
                email: data.payload.after.email
            };
    
            if(data.payload.op == OperationType.CREATE){
                await this.create(payload);
            }
            if(data.payload.op == OperationType.UPDATE){
                await this.update(payload);
            }
        }
    }

    async create(payload: Payload) {
        // const user = await this.usersService.getByRefId(payload.ref_id);
        // if(user){
        //     console.log('Usuario ja existe na base de destino, atualizando...');
        //     return this.update(payload);
        // }
        // await this.usersService.create(payload);
        // return;
    }

    async update(payload: Payload) {
        // para atualizar o usuário, fazemos uma busca pelo ref_id que é o id da base de origem, depois atualizamos o usuario referente ao nosso usuario que tem o id diferente
        // const user = await this.usersService.getByRefId(payload.ref_id);
        // if(!user){
        //     throw new NotFoundException('Usuario da base de origem não encontrado na base de destino');
        // }
        // try {
        //     const updatedUser = await this.usersService.update(user.id, payload);
        //     return updatedUser;
        // } catch (error) {
        //     console.log(error);
        //     throw new InternalServerErrorException('Erro ao atualizar o usuario');
        // }
    }

    async delete(ref_id: number) {
        // const user = await this.usersService.getByRefId(ref_id);
        // if(!user){
        //     throw new NotFoundException('Usuario da base de origem não encontrado na base de destino');
        // }
        // await this.usersService.delete(user.id);
        // return;
    }


}
