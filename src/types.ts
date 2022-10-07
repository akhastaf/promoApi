import { Request } from "express";
import { User } from "./user/entities/user.entity";

export interface Payload {
    sub: number;
    email: string;
    iat: number;
    exp: number;
}

export interface RequestWithAuth extends Request {
    user: User;
}
export interface AuthPayload {
    email: string;
    sub: number;
}
