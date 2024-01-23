import { Component } from '@angular/core';
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AuthService } from 'src/app/@core/services/rest/auth.service';

@Component({
  selector: 'app-client-movement-list',
  templateUrl: './client-movement-list.component.html',
  styleUrls: ['./client-movement-list.component.scss']
})
export class ClientMovementListComponent extends ProtectedComponent {

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService) {
    super(abilityService, authService);
  }
}
