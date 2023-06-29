import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/rest/auth.service";
import { Role } from "../enums/role.enum";

export const roleGuard = (roles: Array<Role>) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userAllowed = roles.some(r => authService.hasRole(r));

    if (userAllowed) {
      return true;
    }

    return router.parseUrl('/auth/denied');
  }
};
