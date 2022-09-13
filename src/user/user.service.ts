import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository : Repository<User>,) {}
  async create(createUserDto: CreateUserDto, user: User): Promise<any> {
    if (!user.isAdmin)
      throw new UnauthorizedException();
    const newuser: User = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(user: User): Promise<User[]> {
    console.log(user);
    if (!user.isAdmin)
      throw new UnauthorizedException();
    return await this.userRepository.find({
      relations: {
        promotions: true,
      }
    });

    
  }

  async findOne(id: number, user: User): Promise<User> {
    if (!user.isAdmin || user.id != id)
      throw new UnauthorizedException();
    try {
      const userTofind = await this.userRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          promotions: true,
        }
      });
      return userTofind;
    } catch {
      throw new NotFoundException('user is not found');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: User) : Promise<UpdateResult> {
    if (!user.isAdmin || user.id != id)
      throw new UnauthorizedException();
    try {
      const userToupdate = await this.userRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          promotions: true,
        }
      });
      return await this.userRepository.update(userToupdate.id, updateUserDto);
    } catch {
      throw new NotFoundException('user is not found');
    }
  }

  async remove(id: number, user: User) : Promise<User> {
    if (!user.isAdmin)
      throw new UnauthorizedException();
    const userToremove = await this.findOne(id, user);
    return this.userRepository.remove(userToremove);
  }

  // async getUsersForCustomer(customer: Customer): Promise<User[]>{
  //   const users = this.userRepository.find({
  //     where: {
  //       customers: {
          
  //       }
  //     }
  //   })
    
  // }

  async findOneByEmail(email: string) : Promise<User> {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          promotions: true,
          customers: true,
        },
      });
      return user;
  }
  async findOneById(id: number) : Promise<User> {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: {
          promotions: true,
          customers: true,
        },
      });
      return user;
  }
}
