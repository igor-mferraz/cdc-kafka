import { Injectable } from "@nestjs/common";
import { DebeziumEnvelope, OperationType } from "../typeDebezium";
import { AddressService } from "src/address/address.service";
import { UsersService } from "src/users/users.service";

type Payload = {
    ref_id?: number;
    user_id?: number;
    street?: string;
    state?: string;
    city?: string;
    country?: string;
}

@Injectable()
export class AddressKafkaService {
    constructor(
        private readonly addressService: AddressService,
        private readonly userService: UsersService
    ) {}

    async processMessage(data: DebeziumEnvelope<any>) {
        if (data?.payload?.op) {
            if (data.payload.op == OperationType.DELETE) {
                await this.delete({ref_id: data.payload.before.ID});
            }

            let payload: Payload = {
                ref_id: data.payload?.after?.ID,
                user_id: data.payload?.after?.USER_ID,
                street: data.payload?.after?.STREET,
                state: data.payload?.after?.STATE,
                city: data.payload?.after?.CITY,
                country: data.payload?.after?.COUNTRY,
            };

            if (data.payload.op == OperationType.CREATE) {
                await this.create(payload);
            }
            if (data.payload.op == OperationType.UPDATE) {
                await this.update(payload);
            }
        }
    }

    async create(payload: Payload) {
        const address = await this.addressService.getByRefId(payload.ref_id);
        const user = await this.userService.getByRefId(payload.user_id);

        //a tabela de destino tem user_id com o ID da base destino, não da origem, por isso devemos buscar o id do usuario da base destino
        //Você usa user_id do usuário (que veio da origem junto da tabela adress) pra achar o user.id real da base de destino.
        
        if(address){
            console.log('Endereço ja existe na base de destino, atualizando...');
            return this.update(payload);
        }
        await this.addressService.create({
            user_id: user.id, // aqui é od id do usuario da base de destino, não o da origem, por isso fazemos a busca antes
            street: payload.street,
            state: payload.state,
            city: payload.city,
            country: payload.country,
            ref_id: payload.ref_id
        });
        return;
    }

    async update(payload: Payload) {
        //para atualizar o usuário, fazemos uma busca pelo ref_id que é o id da base de origem, depois atualizamos o usuario referente ao nosso usuario que tem o id diferente
        console.log(payload)
        const address = await this.addressService.getByRefId(payload.ref_id);
        if(!address){
            console.log('Endereço da base de origem não encontrado na base de destino');
        }
        try {
            const updatedUser = await this.addressService.update(address.id, {
                street: payload.street,
                state: payload.state,
                city: payload.city,
                country: payload.country,
                ref_id: payload.ref_id
            });
            return updatedUser;
        } catch (error) {
            console.log(error);
            console.log('Erro ao atualizar o usuario');
        }
    }

    async delete({ref_id}: {ref_id:number}) {
        const user = await this.addressService.getByRefId(ref_id);
        if(!user){
            console.log('Endereço da base de origem não encontrado na base de destino');
        }
        await this.addressService.delete(user.id);
        return;
    }

}