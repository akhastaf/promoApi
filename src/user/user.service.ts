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
@Injectable()
export class UserService {
  constructor(private promotionServivce: PromotionService,
              //private i18nService: I18nService,
              private jwtService: JwtService,
              private configService: ConfigService,
            @InjectRepository(User) private userRepository : Repository<User>,) {}



  async create(createUserDto: CreateUserDto | RegisterCustomerDto, ability: AppAbility): Promise<any> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Create, User);
      const newuser: User = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newuser);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  
  async findAll(user: User, ability: AppAbility): Promise<User[]> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, User);
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
    } catch (error) {
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

  // async getUsersForCustomer(customer: Customer): Promise<User[]>{
  //   const users = this.userRepository.find({
  //     where: {
  //       customers: {
          
  //       }
  //     }
  //   })
    
  // }

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
  async subscribe(id: number, user: User, ability: AppAbility) {
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
      ForbiddenError.from(ability).throwUnlessCan(Actions.Subscribe, manager);
      user.managers = [manager, ...user.managers];
      await this.userRepository.save(user);
      return  await this.findOne(user.id, ability);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
      throw new NotFoundException();
    }
  }
  async unsubscribe(id: number, user: User, ability: AppAbility) {
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

  async getPromotions(user: User, ability: AppAbility): Promise<Promotion[]> {
    try {
      return await this.promotionServivce.getPromotionsForCustomer(user, ability);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getManagers(user: User, ability: AppAbility): Promise<User[]> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, User);
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
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  // Manager
  async getAllCustomers(manager: User, ability: AppAbility): Promise<User[]> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, User);
      return await this.userRepository.find({
        where: {
          managers: {
              id: manager.id,
          },
        }
      });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
