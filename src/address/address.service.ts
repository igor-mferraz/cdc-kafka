import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) { }

  create(createAddressDto: CreateAddressDto) {
    const user = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(user);
  }

  findAll() {
    return this.addressRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  getByRefId(ref_id: number) {
    try {
      return this.addressRepository.findOne({ where: { ref_id: ref_id } });
    }
    catch (error) {
      console.log('Erro ao buscar usuario por ref_id');
      console.log(error);
    }
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({ where: { id: id } });
    if (!address) {
      throw new NotFoundException('Adress not found');
    }
    await this.addressRepository.update(id, updateAddressDto);
    return;
  }

  async delete(id: number) {
    const address = await this.addressRepository.findOne({ where: { id: id } });
    if (!address) {
      throw new NotFoundException('Adress not found');
    }
    await this.addressRepository.delete(id);
    return;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
