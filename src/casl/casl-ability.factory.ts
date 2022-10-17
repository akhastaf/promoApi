import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "rxjs/internal/scheduler/Action";
import { Customer } from "src/customer/entities/customer.entity";
import { Promotion } from "src/promotion/entities/promotion.entity";
import { User, UserRole } from "src/user/entities/user.entity";


export enum Actions {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    ReadOne = 'readOne',
    Update = 'update', 
    Delete = 'delete',
    Subscribe = 'subscribe',
    UnSubscribe = 'unsubscribe',
}

export type Subjects = InferSubjects<typeof User | typeof Promotion | typeof Customer> | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;


@Injectable()
export class CaslAbilityFactory {
    defineAbility(user: User) {
        const { build, can, cannot } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

        if (user.role === UserRole.ADMIN) {
            cannot(Actions.Create, Promotion).because('you are an admin');
            cannot(Actions.Update, Promotion).because('you are an admin');
            cannot(Actions.Delete, Promotion).because('you are an admin');
            // cannot(Actions.Subscribe, User).because('you are an admin');
            // cannot(Actions.UnSubscribe, User).because('you are an admin');
            can(Actions.Manage, User);
            can(Actions.Read, Promotion);
            can(Actions.ReadOne, Promotion);
            can(Actions.Read, Customer);
            can(Actions.ReadOne, Customer);
            can(Actions.Delete, Customer);
        } else if (user.role === UserRole.MODERATOR) {
            can(Actions.Manage, User, { id: { $eq: user.id }});
            cannot(Actions.Manage, Promotion).because('you are an moderator');
            // cannot(Actions.Subscribe, User).because('you are an admin');
            // cannot(Actions.UnSubscribe, User).because('you are an admin');
            cannot(Actions.Manage, Customer).because('you are a moderator');
            can(Actions.Create, User);
            can(Actions.Read, User);
            can(Actions.Update, User, { role: { $eq : UserRole.MANAGER } });
            can(Actions.ReadOne, User, { role: { $eq : UserRole.MANAGER }});
            cannot(Actions.ReadOne, User, { role: UserRole.ADMIN}).because('you are not admin');
        }
        else if (user.role === UserRole.MANAGER) {
            can(Actions.Manage, Promotion, { 'user.id': { $eq: user.id }})
            can(Actions.Manage, User, { id: { $eq: user.id }})
            can(Actions.Read, Customer);
            can(Actions.Delete, Customer, { 'store.id' : { $eq: user.id } });
            cannot(Actions.Manage, Promotion, { 'user.id': { $ne: user.id }})
            // cannot(Actions.Subscribe, User).because('you are an manager');
            // cannot(Actions.UnSubscribe, User).because('you are an manger');
            cannot(Actions.Read, User).because('you are an manger');
        }
        return build({
            detectSubjectType: (item) => 
                    item.constructor as ExtractSubjectType<Subjects>
        });
    }
}
