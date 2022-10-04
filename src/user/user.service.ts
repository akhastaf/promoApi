import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterCustomerDto } from 'src/auth/dto/register-customer.dto';
import { PromotionService } from 'src/promotion/promotion.service';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { ResetDTO } from 'src/auth/dto/reset.dto';
import { ForbiddenError } from '@casl/ability';
import { ConfigService } from '@nestjs/config';
import { Actions, AppAbility } from 'src/casl/casl-ability.factory';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CustomerToManager } from './entities/customer_to_manager.entity';
@Injectable()
export class UserService {
  constructor(private promotionServivce: PromotionService,
              //private i18nService: I18nService,
              private jwtService: JwtService,
              private configService: ConfigService,
            @InjectRepository(CustomerToManager) private customerToManagerRepository : Repository<CustomerToManager>,
            @InjectRepository(User) private userRepository : Repository<User>,) {}



  async create(createUserDto: CreateUserDto | RegisterCustomerDto,
              i18n: I18nContext,
              ability?: AppAbility): Promise<any> {
    try {
      if (ability)
        ForbiddenError.from(ability).throwUnlessCan(Actions.Create, User);
      const newuser: User = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newuser);
    } catch (error) {
      throw new ForbiddenException(await i18n.t('test.user.ERROR'));
    }
  }
  
  async findAll(user: User,
                option: IPaginationOptions,
                ability: AppAbility): Promise<Pagination<User>> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, User);
      const qb = this.userRepository.createQueryBuilder('user');
      if (user.role === UserRole.ADMIN)
        return await paginate<User>(this.userRepository, option);
      if (user.role === UserRole.MODERATOR)
        qb.where('user.role = :role', { role: UserRole.MANAGER });
      if (user.role === UserRole.MANAGER) 
      {
        qb.leftJoin('user.managers', 'managers')
          .select(['user', 'managers.subcribeDate'])
          .where('managers.managerId = :id', { id: user.id});
      }
      if (user.role === UserRole.CUSTOMER) 
      {
        qb.leftJoin('user.customers', 'customers')
          .leftJoinAndSelect('user.promotions', 'promotions')
          .where('customers.customerId = :id', { id: user.id});
      }
      return await paginate<User>(qb, option);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
    }
    
  }

  async findOne(id: number, ability: AppAbility): Promise<User> {
    try {
      const userTofind = await this.userRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          promotions: true,
          managers: true,
          customers: true,
        }
      });
      ForbiddenError.from(ability).throwUnlessCan(Actions.ReadOne, userTofind);
      return userTofind;
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
      throw new NotFoundException('user not found');
    }
  }
  
  async update(id: number, updateUserDto: UpdateUserDto, ability: AppAbility) : Promise<UpdateResult> {
    try {
      
      const userToupdate = await this.userRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          promotions: true,
        }
      });
      ForbiddenError.from(ability).throwUnlessCan(Actions.Upadate, userToupdate);
      return await this.userRepository.update(userToupdate.id, updateUserDto);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message)
      throw new NotFoundException('user is not found');
      }
    }
    
    async remove(id: number, ability: AppAbility) : Promise<User> {
      try {
        const userToremove = await this.findOne(id, ability);
        ForbiddenError.from(ability).throwUnlessCan(Actions.Delete, userToremove);
        return this.userRepository.remove(userToremove);
      } catch (error) {
        throw new ForbiddenException(error.message)
    }
  }

  async generateToken(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          email,
        }
      });
      user.token = this.jwtService.sign(
      { email: user.email,
        sub: user.id
      }, 
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      });
      return this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('email not exsist');
    }
  }
  async reset(token: string, resetDto: ResetDTO): Promise<void> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          email: resetDto.email
        }
      });
      if (!(await bcrypt.compare(resetDto.old_password, user.password)))
        throw new ForbiddenException('password or email are incorect');
        if (token != user.token)
        throw new ForbiddenException('token not valid');
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
        ignoreExpiration: false,
      });
      user.password = await bcrypt.hash(resetDto.new_password, 10);
      user.token = null;
      await this.userRepository.save(user);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async findOneByEmail(email: string) : Promise<User> {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
        }
      });
      return user;
  }
  async findOneById(id: number, role?: any) : Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          id,
          role: role
        }
      });
      return user;
    } catch (error) {
      throw new NotFoundException('user not found');
    }
  }

  // Customer
  async subscribe(id: number, user: User, ability: AppAbility) {
    try {
      const manager = await this.userRepository.findOneOrFail({
        where: {
          id: id,
          role: UserRole.MANAGER
        }
      })
      ForbiddenError.from(ability).throwUnlessCan(Actions.Subscribe, manager);
      //user.managers = [manager, ...user.managers];
      const customertoManager = this.customerToManagerRepository.create({customer: user, manager: manager})
      await this.customerToManagerRepository.save(customertoManager);
      return  await this.findOne(user.id, ability);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
      console.log(error.message);
      throw new NotFoundException();
    }
  }
  async unsubscribe(id: number, user: User, ability: AppAbility) {
    try {
      const manager = await this.userRepository.findOneOrFail({
        where: {
          id: id,
          role: UserRole.MANAGER
        }
      })
      ForbiddenError.from(ability).throwUnlessCan(Actions.UnSubscribe, manager);
      await this.userRepository
                .createQueryBuilder()
                .relation(User, 'managers')
                .of({ id: user.id})
                .remove({id: manager.id});
      
      return  await this.findOne(user.id, ability);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
      throw new NotFoundException();
    }
  }

  async updateToken(user: User, token: string) {
    return await this.userRepository.update(user.id, { token: token });
  }
}
