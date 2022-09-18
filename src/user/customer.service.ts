import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { PromotionService } from 'src/promotion/promotion.service';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private promotionServivce: PromotionService,
              @InjectRepository(User) private userRepository: Repository<User>,) {}
  /* async join(id: number, user: User) {
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
    console.log(user);
    const promotions = await this.promotionServivce.getPromotionsForCustomer(user);
    console.log(promotions);
    return promotions;
    //return await this.promotionServivce.findAllForCustomer(user);
  }
  async getManagers(user: User): Promise<User[]> {
    const managers = await this.userRepository.find({
      where: {
        customers: {
          id: user.id,
        }
      },
      relations: {
        promotions:true,
      }
    })
    console.log(managers);
    return managers;
    //return await this.promotionServivce.findAllForCustomer(user);
  } */
}
