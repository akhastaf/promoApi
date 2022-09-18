import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionService {
  constructor (@InjectRepository(Promotion) private promotionRepository: Repository<Promotion>,) {}
  async create(createPromotionDto: CreatePromotionDto, user: User): Promise<Promotion> {
    const promo = this.promotionRepository.create(createPromotionDto);
    promo.user = user;
    return await this.promotionRepository.save(promo);
  }

  async findAll(user: User) : Promise<Promotion[]> {
    if (user.role === UserRole.ADMIN)
      return await this.promotionRepository.find();
    return await this.promotionRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      relations : {
        user: true,
      }
    });
  }

  async findOne(id: number, user: User) : Promise<Promotion>{
    try {
        const promotion = await this.promotionRepository.findOneOrFail({
          where: {
            id: id,
          },
          relations: {
            user: true,
          }
        });
        if (user.role === UserRole.ADMIN || promotion.user.id === user.id)
          return promotion;
        throw new ForbiddenException();
    } catch {
        throw new BadRequestException('promotion dosent exist');
    }
    
  }

  async update(id: number, updatePromotionDto: UpdatePromotionDto, user: User) : Promise<UpdateResult> {
    try {
      const promo = await this.promotionRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          user: true,
        }
      });
      if (user.id === promo.user.id)
        return await this.promotionRepository.update(promo.id, updatePromotionDto);
      throw new ForbiddenException();

    } catch {
      throw new BadRequestException('promotion dosent exist');
    }
  }

  async remove(id: number) : Promise<Promotion> {
    try {
      const promo = await this.promotionRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          user: true,
        }
      });
      return await this.promotionRepository.remove(promo);

    } catch {
      throw new BadRequestException('promotion dosent exist');
    }
  }

  async getPromotionsForCustomer(customer: User): Promise<Promotion[]> {
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
  }
}
