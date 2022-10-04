import { CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { Request } from "express";


export class LogGuard implements CanActivate {
    logger : Logger = new Logger(LogGuard.name);
    canActivate(context: ExecutionContext): boolean | Promise<boolean>{
        const request: Request = context.switchToHttp().getRequest();
        this.logger.log(request.headers);
        return true;
    }

}