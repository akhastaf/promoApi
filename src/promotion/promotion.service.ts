import { ForbiddenError } from '@casl/ability';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Actions, AppAbility } from 'src/casl/casl-ability.factory';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionService {
  constructor (@InjectRepository(Promotion) private promotionRepository: Repository<Promotion>,) {}
  async create(createPromotionDto: CreatePromotionDto, user: User, ability: AppAbility): Promise<Promotion> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Create, Promotion);
      const promo = this.promotionRepository.create(createPromotionDto);
      promo.user = user;
      return await this.promotionRepository.save(promo);
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
      const qb = this.promotionRepository.createQueryBuilder('promotion');
      if (user.role === UserRole.ADMIN)
        return await paginate<Promotion>(this.promotionRepository, option);
      if (user.role === UserRole.CUSTOMER)
      {
        qb.leftJoinAndSelect('promotion.user', 'user')
          .leftJoin('user.customers', 'customers')
          .where('customers.id = :id', { id: user.id});
          return await paginate<Promotion>(qb, option);
        }
      else if (user.role === UserRole.MANAGER){
        qb.leftJoinAndSelect('promotion.user', 'user')
        .where('promotion.user = :userId', { userId: user.id});
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
      ForbiddenError.from(ability).throwUnlessCan(Actions.Upadate, promotion);
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
      ForbiddenError.from(ability).throwUnlessCan(Actions.Upadate, promotion);
      return await this.promotionRepository.remove(promotion);
      
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
        throw new BadRequestException('promotion dosent exist');
      }
  }
      
  async getPromotionsForCustomer(customer: User, ability: AppAbility): Promise<Promotion[]> {
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Upadate, Promotion);
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
