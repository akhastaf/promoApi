import { Request } from "express";
import { User } from "./user/entities/user.entity";

export interface RequestWithAuth extends Request {
    user: User;
}
export interface AuthPayload {
    email: string;
    sub: number;
}
