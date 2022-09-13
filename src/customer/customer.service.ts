import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(private userService: UserService,
              private jwtService: JwtService,
              @InjectRepository(Customer) private customerRepository: Repository<Customer>,
              @InjectRepository(Promotion) private promotionRepository: Repository<Promotion>,) {}
  async create(createCustomerDto: CreateCustomerDto) : Promise<any> {
    const user = await this.userService.findOneById(createCustomerDto.userId);
    if (user)
    {
      const customer = this.customerRepository.create(createCustomerDto);
      customer.users = [user];
      const savedCustomer =  await this.customerRepository.save(customer);
      return {
        customer: savedCustomer,
        access_token: this.jwtService.sign({ email: savedCustomer.email, sub: savedCustomer.id}),
      };
    }
    throw new BadRequestException();
  }

  async join(id: number, customer: Customer) : Promise<Customer> {
    const user = await this.userService.findOneById(id);
    customer.users = [user, ...customer.users];
    return await this.customerRepository.save(customer);
  }

  async findAll(user: User) : Promise<Customer[]> {
    if (user.isAdmin)
      return await this.customerRepository.find({
        relations: {
          users: true,
        }
      });
    return await this.customerRepository.find({
      // where: {
      //   user: {
      //     id: user.id,
      //   },
      // },
      relations: {
        users: true,
      }
    });
  }

  async findOne(id: number, user: User) : Promise<Customer> {
    try {
      if (user.isAdmin)
        return await this.customerRepository.findOneOrFail({
          where: {
            id,
          },
          relations: {
            users: true,
          }
        });
      return await this.customerRepository.findOneOrFail({
        where: {
          id
        },
        relations: {
          users: true,
        }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto, customer: Customer) : Promise<UpdateResult> {
    if (customer.id != id)
      throw new UnauthorizedException();
    try {
      const customerToUpadate = await this.customerRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          users: true,
        }
      });
      return await this.customerRepository.update(customerToUpadate.id, updateCustomerDto);
    } catch {
      throw new BadRequestException('promotion dosent exist');
    }
  }

  // async getAllPromotions(customer: Customer) {
  //   return await this.promotionRepository.find({
  //     where: {
  //       user: {
  //         id: customer.user.id,
  //       },
  //     },
  //     relations: {
  //       user: true,
  //     }
  //   });
  // }
  
  async getPromotionsOfUser(id: number, customer: Customer) {
    const promotions =  await this.promotionRepository.find({
      where: {
        user: {
          id: id,
        },
      },
      relations: {
        user: true,
      }
    });
    const filtred = promotions.map((promo) => (promo.user.customers.find((c) => (c.id === customer.id))))
    return filtred;
  }

  // async getUsers(customer: Customer) {
  //   return  await this.customerRepository.fi(customer);
  // }


  async findOneByEmail(email: string) : Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        users: true,
      },
    });
    return customer;
  } 

  async findOneById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: {
        id,
      },
      relations: {
        users: true,
      },
    });
    return customer;
  }



  // async remove(id: number) : Promise<Customer> {
  // }
}
