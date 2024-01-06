import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Actions, AppAbility, Subjects } from "../../auth/ability";
import { AbilityService } from "@casl/angular";

@Injectable({
  providedIn: 'root'
})
export class ProtectedComponent {
  public readonly ability$: Observable<AppAbility>;
  public ability?: AppAbility;

  constructor(public abilityService: AbilityService<AppAbility>) {
    this.ability$ = abilityService.ability$;
    this.ability$.subscribe((x) => this.ability = x);
  }

  protected ableTo(action: Actions, subject: Subjects) {
    return this.ability?.can(action, subject) ?? false;
  }
}
