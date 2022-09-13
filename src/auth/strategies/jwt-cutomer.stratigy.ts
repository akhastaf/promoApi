import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { CustomerService } from "src/customer/customer.service";
import { AuthPayload } from "src/types";

@Injectable()
export class JWTStrategyForCustomer extends PassportStrategy(Strategy, 'jwt-customer') {
    constructor (private configService: ConfigService, private customerService: CustomerService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: AuthPayload) {
        const user = await this.customerService.findOneById(payload.sub);
        return user;
    }
}