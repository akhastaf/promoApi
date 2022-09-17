import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "rxjs/internal/scheduler/Action";
import { Promotion } from "src/promotion/entities/promotion.entity";
import { User, UserRole } from "src/user/entities/user.entity";

export enum Actions {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Upadate = 'update', 
    Delete = 'delete'
}

export type Subjects = InferSubjects<typeof User | typeof Promotion> | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;


@Injectable()
export class CaslAbilityFactory {
    defineAbility(user: User) {
        const { build, can, cannot } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

        if (user.role === UserRole.ADMIN) {
            can(Actions.Manage, 'all');
        } else if (user.role === UserRole.MODERATOR) {
            can(Actions.Create, User);
            can(Actions.Read, User);
        }
        else if (user.role === UserRole.MANAGER) {
            can(Actions.Manage, Promotion, { user: { id: user.id}})
            //can(Actions.Read, User, { customers: { id: user.id}})
        }
        else if (user.role === UserRole.CUSTOMER) {
            can(Actions.Manage, User, { id: { $eq: user.id} });
            //can(Actions.Read, Promotion, { })
        }

        return build({
            detectSubjectType: (item) => 
                    item.constructor as ExtractSubjectType<Subjects>
        });
    }
}
