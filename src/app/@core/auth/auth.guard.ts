import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/rest/auth.service";

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(authService.authenticatedUser);

  if (authService.authenticatedUser) {
    return true;
  }

  return router.parseUrl('/auth/login');
};
