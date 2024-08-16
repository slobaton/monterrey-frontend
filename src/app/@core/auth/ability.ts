import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { Role } from "../enums/role.enum";

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'client' | 'cloth-size' | 'cloth-type' | 'effect' | 'parameter' | 'user' | 'wash-order' | 'wash-type' | 'income' | 'income-receipt' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export function defineAbilitiesFor(role: Role) {
  const { can, rules } = new AbilityBuilder(AppAbility);

  if (role === Role.ADMIN) {
    can('manage', 'all');
  } else if (role === Role.SECRETARY) {
    can(['create', 'read'], 'all');
    can(['update', 'delete'], ['wash-order']);
  } else if (role === Role.RECEPTIONIST) {
    can('read', ['client', 'cloth-size', 'cloth-type', 'wash-type', 'wash-order', 'effect']);
    can('create', ['wash-order', 'client']);
    can(['update', 'delete'], ['wash-order']);
  }

  return rules;
}
