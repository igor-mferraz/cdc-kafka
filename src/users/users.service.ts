import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {


  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  getByRefId(ref_id: number) {
    return this.userRepository.findOne({ where: { ref_id: ref_id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
