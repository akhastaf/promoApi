import { SetMetadata } from "@nestjs/common";
import { Actions, Subjects } from "../casl-ability.factory";

export interface RequiredRule {
    actions: Actions;
    subjects: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirments: RequiredRule[]) => 
    SetMetadata(CHECK_ABILITY, requirments);