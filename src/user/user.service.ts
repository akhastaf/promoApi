import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterCustomerDto } from 'src/auth/dto/register-customer.dto';
import { PromotionService } from 'src/promotion/promotion.service';
import { Promotion } from 'src/promotion/entities/promotion.entity';

@Injectable()
export class UserService {
  constructor(private promotionServivce: PromotionService,
            @InjectRepository(User) private userRepository : Repository<User>,) {}
  async create(createUserDto: CreateUserDto | RegisterCustomerDto): Promise<any> {
    /* if (user.role != UserRole.ADMIN)
      throw  new UnauthorizedException();*/
    const newuser: User = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newuser);
  }

  async findAll(user: User): Promise<User[]> {
   /*  if (user.role != UserRole.ADMIN)
      throw new UnauthorizedException(); */
    if (user.role === UserRole.ADMIN)
      return await this.userRepository.find({
        relations: {
          promotions: true,
        }
      });
    return await this.userRepository.find({
      where: {
        role: UserRole.MANAGER,
      },
      relations: {
        promotions: true,
      }
    });
    
  }

  async findOne(id: number): Promise<User> {
    /* if (user.role != UserRole.ADMIN || user.id != id)
      throw new UnauthorizedException(); */
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

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<UpdateResult> {
    /* if (user.role != UserRole.ADMIN || user.id != id)
      throw new UnauthorizedException(); */
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

  async remove(id: number) : Promise<User> {
   /*  if (user.role != UserRole.ADMIN)
      throw new UnauthorizedException(); */
    const userToremove = await this.findOne(id);
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
          managers: true,
        },
      });
      return user;
  }
  async findOneById(id: number, role?: any) : Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          id,
          role: role
        },
        relations: {
          promotions: true,
          customers: true,
        },
      });
      return user;
    } catch (error) {
      throw new NotFoundException('user not found');
    }
  }

  // Customer
  async join(id: number, user: User) {
    try {
      const manager = await this.userRepository.findOneOrFail({
        where: {
          id: id,
          role: UserRole.MANAGER
        },
        relations: {
          customers: true,
          managers: true,
          promotions: true,
        }
      })
      user.managers = [manager, ...user.managers];
      return await this.userRepository.save(user);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getPromotions(user: User): Promise<Promotion[]> {
    return await this.promotionServivce.getPromotionsForCustomer(user);
  }

  async getManagers(user: User): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        customers: {
          id: user.id,
        }
      },
      relations: {
        promotions:true,
      }
    });
  }
  // Manager
  async getAllCustomers(manager: User): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        customers: {
          managers: {
            id: manager.id,
          },
        },
      }
    });
  }
}
