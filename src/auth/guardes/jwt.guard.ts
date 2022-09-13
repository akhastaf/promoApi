import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {}


@Injectable()
export class JWTGuardForCustomer extends AuthGuard('jwt-customer') {}