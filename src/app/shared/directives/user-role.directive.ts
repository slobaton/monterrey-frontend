import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Role } from 'src/app/@core/enums/role.enum';
import { AuthService } from 'src/app/@core/services/rest/auth.service';

@Directive({
  selector: '[appUserRole]'
})
export class UserRoleDirective implements OnInit {

  userRoles: Array<Role> = [];

  @Input()
  set appUserRole(roles: Array<Role>) {
    if (!roles || !roles.length) {
      throw new Error('Roles value is empty or missed');
    }

    this.userRoles = roles;
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private authService: AuthService,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit(): void {
    let hasAccess = false;

    if (this.authService.authenticatedUser && this.userRoles) {
      hasAccess = this.userRoles.some(r => this.authService.hasRole(r));
    }

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
