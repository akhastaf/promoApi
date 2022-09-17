import { ForbiddenError } from "@casl/ability";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core";
import { CaslAbilityFactory } from "../casl-ability.factory";
import { CHECK_ABILITY, RequiredRule } from "../decorators/abilities.decorator";

@Injectable()
export class AbilitiesGuards implements CanActivate {

    constructor(private reflector: Reflector,
                private caslAbilityFactory: CaslAbilityFactory) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];

        const { user } = context.switchToHttp().getRequest();
        const ability = this.caslAbilityFactory.defineAbility(user);


        try {
            rules.forEach((rule) =>
                ForbiddenError.from(ability).throwUnlessCan(rule.actions, rule.subjects),
            );

            return true;
        } catch (error) {
            if (error instanceof ForbiddenError)
                throw new ForbiddenException(error.message);
        }

    }
    
}