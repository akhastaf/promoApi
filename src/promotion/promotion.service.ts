import { ForbiddenError } from '@casl/ability';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TwilioService } from 'nestjs-twilio';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Actions, AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Customer } from 'src/customer/entities/customer.entity';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { NotificationListInstanceCreateOptions } from 'twilio/lib/rest/notify/v1/service/notification';
import { Repository, UpdateResult } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionService {
  constructor (
      private configService: ConfigService,
      private twilioService: TwilioService,
      private readonly abilityFactory: CaslAbilityFactory,
      private userService : UserService,
      @InjectRepository(Promotion) private promotionRepository: Repository<Promotion>,
      @InjectRepository(Customer) private customerRepo: Repository<Customer>,) {}
  
  
  async create(createPromotionDto: CreatePromotionDto, user: User) {
    try {
      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Actions.Create, Promotion);
      const promo = this.promotionRepository.create(createPromotionDto);
      promo.user = user;
      const promotion = await this.promotionRepository.save(promo);
      const customers = await this.customerRepo.find({
        where: {
          store: {
            id: user.id
          },
        }
      });
      if (customers.length) {
        const service = this.twilioService.client.notify.services(user.notify_sid);
        console.log(user.notify_sid);
        const bindings = customers.map(customer => {
          return JSON.stringify({ binding_type: 'sms', address: customer.phone });
        });
        for (const customer of customers) {
          const sms = {
              body: `${promotion.title} ${promotion.description}`,
              from: user.number_twilio,
              to: customer.phone,
              mediaUrl: promotion.image,
          };
          console.log("sms ", sms);
          this.twilioService.client.messages.create({
            body: `${promotion.title} ${promotion.description}`,
            from: user.number_twilio,
            to: customer.phone,
            mediaUrl: promotion.image,
          }).then(message => {
            console.log('SMS successfully sent');
            console.log(message.sid);
          }).catch(error => {
            console.error('message ', error);
          })
        }
        // let not;
        // let t: NotificationListInstanceCreateOptions;
        // service.notifications
        //   .create({
        //     toBinding: bindings,
        //     body:  `${promotion.title} ${promotion.description}`,
            
        //   })
        //   .then(async (notification) => {
        //     await this.userService.updateCount(user, bindings.length);
        //   })
        //   .catch(err => {
        //     console.error(err);
        //   });
        //   return not;
      }
      return promotion;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  
  async findAll(user: User,
                option: IPaginationOptions,
                ) : Promise<Pagination<Promotion>> 
  {
    try {
      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, Promotion);
      const qb = this.promotionRepository.createQueryBuilder('promotions');
      qb.leftJoinAndSelect('promotions.user', 'store');
      // qb.leftJoinAndSelect('promotions.user', 'store');
      if (user.role === UserRole.ADMIN) {
        return await paginate<Promotion>(this.promotionRepository, option);
      }
      else if (user.role === UserRole.STORE){
        qb.where('promotions.user = :userId', { userId: user.id});
        return await paginate<Promotion>(qb, option);
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  
  async findAllForStore(id: number, option: IPaginationOptions, user: User) :Promise<Pagination<Promotion>> {
    try {
      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, Promotion);
      const qb = this.promotionRepository.createQueryBuilder('promotions');
      qb.leftJoinAndSelect('promotions.user', 'store');
      if (user.role === UserRole.ADMIN) {
        qb.where('store.id = :id', { id: id });
        // return await paginate<Promotion>(this.promotionRepository, option);
      }
      else if (user.role === UserRole.STORE){
        qb.where('promotions.user = :userId', { userId: user.id});
      }
      return await paginate<Promotion>(qb, option);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  
  async update(id: number, updatePromotionDto: UpdatePromotionDto, user: User) : Promise<UpdateResult> {
    try {
      const ability = this.abilityFactory.defineAbility(user);
      const promotion = await this.promotionRepository.findOneOrFail({
        where: {
          id,
        },
        relations: ['user', 'user.customers']
      });
      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, promotion);
      return await this.promotionRepository.update(promotion.id, updatePromotionDto);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
        throw new BadRequestException('promotion dosent exist');
      }
    }
    
  async remove(id: number, user: User) : Promise<Promotion> {
    try {
      const ability = this.abilityFactory.defineAbility(user);
      const promotion = await this.promotionRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          user: true,
        }
      });
      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, promotion);
      return await this.promotionRepository.remove(promotion);
      
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
        throw new BadRequestException('promotion dosent exist');
      }
  }
      
  // async getPromotionsForCustomer(customer: User, ability: AppAbility): Promise<Promotion[]> {
  //   try {
  //     ForbiddenError.from(ability).throwUnlessCan(Actions.Update, Promotion);
  //     return await this.promotionRepository.find({
  //       where: {
  //         user: {
  //           customers: {
  //             id: customer.id
  //           }
  //         }
  //       },
  //       relations: {
  //         user: true,
  //       }
  //     });
  //   } catch (error) {
  //     throw new ForbiddenException(error.message);
  //   }
  // }
}
