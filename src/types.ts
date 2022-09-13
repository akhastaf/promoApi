import { Request } from "express";
import { Customer } from "./customer/entities/customer.entity";
import { User } from "./user/entities/user.entity";

export interface RequestWithAuth extends Request {
    user: User;
}
export interface RequestWithCustomer extends Request {
    user: Customer;
}
export interface AuthPayload {
    email: string;
    sub: number;
}
