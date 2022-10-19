import { ForbiddenError } from '@casl/ability';
import { ForbiddenException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { JWTGuard } from 'src/auth/guardes/jwt.guard';
import { Actions, AppAbility } from 'src/casl/casl-ability.factory';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(private userService: UserService,
              @InjectRepository(Customer) private customerRepo: Repository<Customer>,) {}

  async create(id: number, createCustomerDto: CreateCustomerDto) : Promise<Customer> {
    try {
      const store = await this.userService.findOneById(id);
      if (store.customers.find((customer) => customer.phone === createCustomerDto.phone))
        throw new ForbiddenException('You are already subscribed to this store');
      console.log(store);
      if (store.id === id) {
        const customer = this.customerRepo.create(createCustomerDto);
        customer.store = store;
        return await this.customerRepo.save(customer);
      }
      
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  
  async findAll(option: IPaginationOptions, user: User, ability: AppAbility) : Promise<Pagination<Customer>> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, Customer);
      const qb = this.customerRepo.createQueryBuilder('customers');
      if (user.role === UserRole.MANAGER)
        qb.leftJoinAndSelect('customers.store', 'store')
          .where('store.id = :userId', { userId: user.id});
      return await paginate<Customer>(qb, option);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
    }
    const qb = this.customerRepo.createQueryBuilder('customers');
    return await paginate<Customer>(qb, option);
  }
  async findAllForStore(id: number, option: IPaginationOptions, user: User, ability: AppAbility) : Promise<Pagination<Customer>> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, Customer);
      const qb = this.customerRepo.createQueryBuilder('customers')
            .leftJoinAndSelect('customers.store', 'store')
            .where('store.id = :id', { id: id});
      return await paginate<Customer>(qb, option);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
    }
    const qb = this.customerRepo.createQueryBuilder('customers');
    return await paginate<Customer>(qb, option);
  }



  // update(id: number, updateCustomerDto: UpdateCustomerDto) {
  //   return `This action updates a #${id} customer`;
  // }

  async remove(id: number, user: User, ability: AppAbility) {
    try {
      const customer = await this.customerRepo.findOneOrFail({
        where: {
          id,
        },
        relations: {
          store: true,
        }
      });
      ForbiddenError.from(ability).throwUnlessCan(Actions.Delete, customer);
      return await this.customerRepo.remove(customer);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
      throw new NotFoundException('customer not found');
    }
  }
}
