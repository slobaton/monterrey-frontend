import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Actions, AppAbility, Subjects } from "../../auth/ability";
import { AbilityService } from "@casl/angular";
import { AuthService } from "../../services/rest/auth.service";
import { Role } from "../../enums/role.enum";

@Injectable({
  providedIn: 'root'
})
export class ProtectedComponent {
  public readonly ability$: Observable<AppAbility>;
  public ability?: AppAbility;

  constructor(
    public abilityService: AbilityService<AppAbility>,
    protected authService: AuthService,
  ) {
    this.ability$ = abilityService.ability$;
    this.ability$.subscribe((x) => this.ability = x);
  }

  protected ableTo(action: Actions, subject: Subjects) {
    return this.ability?.can(action, subject) ?? false;
  }

  protected hasAdminRole() {
    return this.authService.hasRole(Role.ADMIN);
  }

  protected hasSecretaryRole() {
    return this.authService.hasRole(Role.SECRETARY);
  }

  protected hasReceptionistRole() {
    return this.authService.hasRole(Role.RECEPTIONIST);
  }
}
