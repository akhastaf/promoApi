import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "rxjs/internal/scheduler/Action";
import { Promotion } from "src/promotion/entities/promotion.entity";
import { User, UserRole } from "src/user/entities/user.entity";


export enum Actions {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    ReadOne = 'readOne',
    Upadate = 'update', 
    Delete = 'delete',
    Subscribe = 'subscribe',
    UnSubscribe = 'unsubscribe',
}

export type Subjects = InferSubjects<typeof User | typeof Promotion> | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;


@Injectable()
export class CaslAbilityFactory {
    defineAbility(user: User) {
        const { build, can, cannot } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

        if (user.role === UserRole.ADMIN) {
            cannot(Actions.Create, Promotion).because('you are an admin');
            cannot(Actions.Upadate, Promotion).because('you are an admin');
            cannot(Actions.Delete, Promotion).because('you are an admin');
            cannot(Actions.Subscribe, User).because('you are an admin');
            cannot(Actions.UnSubscribe, User).because('you are an admin');
            can(Actions.Manage, User);
        } else if (user.role === UserRole.MODERATOR) {
            cannot(Actions.Manage, Promotion).because('you are an moderator');
            cannot(Actions.Subscribe, User).because('you are an admin');
            cannot(Actions.UnSubscribe, User).because('you are an admin');
            can(Actions.Create, User);
            can(Actions.Read, User);
            can(Actions.ReadOne, User, { role: { $eq : UserRole.MANAGER }});
            cannot(Actions.ReadOne, User, { role: UserRole.ADMIN}).because('you are not admin');
        }
        else if (user.role === UserRole.MANAGER) {
            can(Actions.Manage, Promotion, {'user.id': { $eq: user.id }})
            //cannot(Actions.Manage, Promotion, { user: { id: { $ne: user.id }}})
        }
        else if (user.role === UserRole.CUSTOMER) {
            cannot(Actions.Create, Promotion).because('you are an customer');
            cannot(Actions.Upadate, Promotion).because('you are an customer');
            cannot(Actions.Delete, Promotion).because('you are an customer');
            cannot(Actions.ReadOne, Promotion, { user: { customers: { id: {$ne: user.id}}}})
            can(Actions.ReadOne, Promotion);
            can(Actions.ReadOne, User, { id: user.id });
            can(Actions.Subscribe, User, { role: UserRole.MANAGER });
            can(Actions.UnSubscribe, User, { role: UserRole.MANAGER });
        }

        return build({
            detectSubjectType: (item) => 
                    item.constructor as ExtractSubjectType<Subjects>
        });
    }
}
