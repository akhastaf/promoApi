import { ForbiddenError } from '@casl/ability';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TwilioService } from 'nestjs-twilio';
// import { TwilioModule } from 'nestjs-twilio';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { identity } from 'rxjs';
import { Actions, AppAbility } from 'src/casl/casl-ability.factory';
import { Customer } from 'src/customer/entities/customer.entity';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionService {
  constructor (
      private configService: ConfigService,
      private twilioService: TwilioService,
      @InjectRepository(Promotion) private promotionRepository: Repository<Promotion>,
      @InjectRepository(Customer) private customerRepo: Repository<Customer>,) {}
  
  
      async create(createPromotionDto: CreatePromotionDto, user: User, ability: AppAbility): Promise<Promotion> {
    try {
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
      console.log(customers[0]);
      if (customers.length) {
        const service = this.twilioService.client.notify.services(this.configService.get('TWILIO_NOTIFY_SID'));
        const bindings = customers.map(customer => {
          return JSON.stringify({ binding_type: 'sms', address: customer.phone });
        });
        
        service.notifications
          .create({
            toBinding: bindings,
            body:  `${promotion.title} ${promotion.description}`,
          })
          .then(notification => {
            console.log(notification);
          })
          .catch(err => {
            console.error(err);
          });
        // Send for one
        // this.twilioService.client.messages.create({
        //   body: `${promotion.title} ${promotion.description}`,
        //   from: '+13608688988',//this.configService.get('TWILIO_PHONE'),
        //   to: customers[0].phone,
        // });
      }
      return promotion;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  
  async findAll(user: User,
                option: IPaginationOptions,
                ability: AppAbility,
                ) : Promise<Pagination<Promotion>> 
  {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, Promotion);
      const qb = this.promotionRepository.createQueryBuilder('promotions');
      qb.leftJoinAndSelect('promotions.user', 'store');
      // qb.leftJoinAndSelect('promotions.user', 'store');
      if (user.role === UserRole.ADMIN) {
        return await paginate<Promotion>(this.promotionRepository, option);
      }
      else if (user.role === UserRole.MANAGER){
        qb.where('promotions.user = :userId', { userId: user.id});
        return await paginate<Promotion>(qb, option);
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  
  async findOne(id: number, user: User, ability: AppAbility) : Promise<Promotion>{
    try {
      const promotion = await this.promotionRepository.findOneOrFail({
        where: {
          id: id,
        },
        relations: ['user', 'user.customers']
      });
      ForbiddenError.from(ability).throwUnlessCan(Actions.ReadOne, promotion);
      return promotion;
    } catch (error) {
      if (error instanceof ForbiddenException)
        throw new ForbiddenException(error.message);
      throw new BadRequestException('promotion dosent exist');
    }
  }
  
  async update(id: number, updatePromotionDto: UpdatePromotionDto, user: User, ability: AppAbility) : Promise<UpdateResult> {
    try {
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
    
  async remove(id: number, ability: AppAbility) : Promise<Promotion> {
    try {
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
      
  async getPromotionsForCustomer(customer: User, ability: AppAbility): Promise<Promotion[]> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, Promotion);
      return await this.promotionRepository.find({
        where: {
          user: {
            customers: {
              id: customer.id
            }
          }
        },
        relations: {
          user: true,
        }
      });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
