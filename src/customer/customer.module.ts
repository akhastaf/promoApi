import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CaslModule } from 'src/casl/casl.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CaslModule, UserModule],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
