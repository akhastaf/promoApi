import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
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
import { identity } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService,
              private configService: ConfigService,
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
                role: string,
                ability: AppAbility): Promise<Pagination<User>> {
                
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, User);
      const qb = this.userRepository.createQueryBuilder('user');
      if (user.role === UserRole.ADMIN) {
        if (role === UserRole.ALL)
          return await paginate<User>(this.userRepository, option);
        qb.where('user.role = :role', { role: role});
      }
      else if (user.role === UserRole.MODERATOR) {
        console.log(user);
        qb.where('user.role = :role', { role: UserRole.MANAGER });
      }
      else if (user.role === UserRole.MANAGER)
        qb.where('user.id = :id', { id: user.id});
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
          // store: true,
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
      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, userToupdate);
      return await this.userRepository.update(userToupdate.id, updateUserDto);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message)
      throw new NotFoundException('user is not found');
      }
    }

    me(user: User) {
      return user;
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
      console.log(token);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
        ignoreExpiration: false,
      });
      const user = await this.userRepository.findOneOrFail({
        where: {
          email: payload.email
        }
      });
      if (token != user.token)
        throw new ForbiddenException('token not valid');
      user.password = await bcrypt.hash(resetDto.password, 10);
      user.token = null;
      await this.userRepository.save(user);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async findOneByEmail(email: string) : Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          email: email,
        }
      });
      return user;
    } catch (error) {
      throw new ForbiddenException();
    }
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
}
