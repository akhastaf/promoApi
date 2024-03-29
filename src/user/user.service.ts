import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterCustomerDto } from 'src/auth/dto/register-customer.dto';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { ResetDTO } from 'src/auth/dto/reset.dto';
import { ForbiddenError } from '@casl/ability';
import { ConfigService } from '@nestjs/config';
import { Actions, AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { IPaginationOptions, Pagination, paginate} from 'nestjs-typeorm-paginate';
import { MailService } from 'src/mail/mailService';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateMeSecurityDto } from './dto/update-me-security.dto';
import * as PDFDocument from 'pdfkit';
import * as qrcode from 'qrcode';
import { Twilio } from 'twilio';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService,
              private mailService: MailService,
              private configService: ConfigService,
              private readonly abilityFactory: CaslAbilityFactory,
            @InjectRepository(User) private userRepository : Repository<User>,) {}



  async create(createUserDto: CreateUserDto | RegisterCustomerDto,
              user: User,
              i18n: I18nContext): Promise<any> {
    try {
      console.log(createUserDto);

      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Actions.Create, User);
      createUserDto.password = Math.random().toString(36).slice(-8);
      console.log('password: ',createUserDto.password);
      const newuser: User = this.userRepository.create(createUserDto);
      if (newuser.role === UserRole.STORE)
      {
        newuser.salesman = user;
        const client = new Twilio(this.configService.get('TWILIO_ACCOUNT_SID'), this.configService.get('TWILIO_AUTH_TOKEN'));
        const availablePhones = await client.availablePhoneNumbers('US').local.list({ areaCode: 765, limit: 1 });
        console.log(availablePhones);
        if (availablePhones.length) {
          console.log(availablePhones[0].phoneNumber);
          const phoneNumber = await client.incomingPhoneNumbers.create({phoneNumber: availablePhones[0].phoneNumber});
          console.log('phonenumber',phoneNumber);
          newuser.number_twilio = phoneNumber.phoneNumber;
          newuser.number_sid = phoneNumber.sid;
          const service = await client.messaging.v1.services.create({ friendlyName: `${newuser.name}_service`, usecase: 'notifications'});
          console.log('service ', service);
          newuser.service_sid = service.sid;
          newuser.service_name = service.friendlyName;
          await client.messaging.v1.services(service.sid).phoneNumbers.create({ phoneNumberSid: newuser.number_sid });
          const notify = await client.notify.v1.services.create({ friendlyName: `${newuser.name}_notify`, messagingServiceSid: newuser.service_sid});
          console.log(notify);
          newuser.notify_name = notify.friendlyName;
          newuser.notify_sid = notify.sid;
        }
      }
      console.log(newuser);
      const createdUser = await this.userRepository.save(newuser);
      await this.mailService.sendStoreCreation(createdUser.email, createUserDto.password, createdUser.name);
      return createdUser;
    } catch (error) {
      if (error.code === '23505')
        throw new BadRequestException(['email already exists']);
      throw new ForbiddenException(error.message);
    }
  }
  
  async findAll(user: User,
                option: IPaginationOptions,
                role: string,
                order: string): Promise<Pagination<User>> {
                
    try {
      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, User); 
      let orderOption : any;
      if (order === 'email')
        orderOption= {email: 'ASC'};
      else if (order === 'name')
        orderOption= {name: 'ASC'};

      if (user.role === UserRole.ADMIN) {
        if (role === UserRole.ALL)
          return await paginate<User>(this.userRepository, option);
        return await paginate<User>(this.userRepository, option, {
          where: {
            role: role,
          },
          relations: {
            customers: true,
            promotions: true,
            stores: true,
            salesman: true,
          },
          order: orderOption
        });
        }
        else if (user.role === UserRole.SALESMAN) {
          return await paginate<User>(this.userRepository, option, {
            where: {
              role: UserRole.STORE,
              salesman: {
                id: user.id,
              }
            },
            relations: {
              customers: true,
              promotions: true,
              salesman: true,
            },
            order: orderOption
          });
        }
        else if (user.role === UserRole.STORE) {
          return await paginate<User>(this.userRepository, option, {
            where: {
              id: user.id,
            },
            relations: {
              customers: true,
              promotions: true,
              salesman: true,
            },
            order: orderOption,
          });
        }
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
    }
    
  }

  async findOne(id: number): Promise<User> {
    try {
      // const ability = this.abilityFactory.defineAbility(user);
      const userTofind = await this.userRepository.findOneOrFail({
        where: {
          id,
          // role: UserRole.STORE
        },
        relations: {
          promotions: true,
          customers: true,
        }
      });
      // ForbiddenError.from(ability).throwUnlessCan(Actions.ReadOne, userTofind);
      return userTofind;
    } catch (error) {
      // if (error instanceof ForbiddenError)
      //   throw new ForbiddenException(error.message);
      throw new NotFoundException('Store not found');
    }
  }
  
  async update(id: number, updateUserDto: UpdateUserDto, user: User) : Promise<UpdateResult> {
    try {
      const ability = this.abilityFactory.defineAbility(user);
      const userToupdate = await this.userRepository.findOneOrFail({
        where: {
          id,
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
  async updateMeSecurity(user: User, updateMeDto: UpdateMeSecurityDto) : Promise<UpdateResult> {
    try {
      
      // const userToupdate = await this.userRepository.findOneOrFail({
      //   where: {
      //     id: user.id,
      //   }
      // });
      const ability = this.abilityFactory.defineAbility(user);
      if (updateMeDto.password) {
        const valid = await bcrypt.compare(updateMeDto.password, user.password);
        if (!valid)
          throw new ForbiddenException('password incorrect');
        user.password = await bcrypt.hash(updateMeDto.new_password, 10);
      }
      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, user);
      return await this.userRepository.update(user.id, user);
    } catch (error) {
      if (error instanceof ForbiddenError || error instanceof ForbiddenException)
        throw new ForbiddenException(error.message)
      throw new NotFoundException(error.message);
      }
    }
  async updateMe(user: User, updateMeDto: UpdateMeDto) : Promise<UpdateResult> {
    try {
      const ability = this.abilityFactory.defineAbility(user);
      console.log(updateMeDto);
      const userToupdate = await this.userRepository.findOneOrFail({
        where: {
          id: user.id,
        }
      });
      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, user);
      return await this.userRepository.update(user.id, updateMeDto);
    } catch (error) {
      if (error instanceof ForbiddenError || error instanceof ForbiddenException)
        throw new ForbiddenException(error.message)
      throw new NotFoundException(error.message);
      }
    }

    me(user: User) {
      if (user.isActive)
        return user;
      if (user.role === UserRole.SALESMAN)
        throw new ForbiddenException('Your account is inactive contact the admin');

      throw new ForbiddenException('Your account is inactive contact the salesman');
    }
    
    async remove(id: number, user: User) : Promise<User> {
      try {
        const ability = this.abilityFactory.defineAbility(user);
        const userToremove = await this.findOne(id);
        ForbiddenError.from(ability).throwUnlessCan(Actions.Delete, userToremove);
        const client = new Twilio(this.configService.get('TWILIO_ACCOUNT_SID'), this.configService.get('TWILIO_AUTH_TOKEN'));
        if (userToremove.notify_sid.length)
          await client.notify.v1.services(userToremove.notify_sid).remove();
        if (userToremove.service_sid.length)
          await client.messaging.v1.services(userToremove.service_sid).remove();
        if (userToremove.phone.length)
          await client.incomingPhoneNumbers(userToremove.number_sid).remove();
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
        },
        relations: {
          salesman: true,
        }
      });
      return user;
    } catch (error) {
      throw new ForbiddenException('email or password is incorrect');
    }
  }
  async findOneById(id: number, role?: any) : Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          id,
          role: role
        },
        relations: {
          customers: true,
        }
      });
      return user;
    } catch (error) {
      throw new NotFoundException('user not found');
    }
  }

  async getQr(user: User) {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      })
      
      doc.text('Welcome to our store', {
        align: 'center',
      });
      doc.moveDown(10);
      const qr = await qrcode.toDataURL(`${this.configService.get('CLIENT_HOST')}/customer/${user.id}`, { errorCorrectionLevel: 'H' });
      doc.image(qr, {
        align: 'center',
        valign: 'center'
      });
      doc.end()

      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
    })

    return pdfBuffer
  }

  async updateCount(user:User, count: number) {
    return await this.userRepository.update(user.id, { count: user.count + count });  
  }
}
