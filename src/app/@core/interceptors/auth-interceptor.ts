import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AuthService } from '../services/rest/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  public constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.handleToken(req, next);
  }

  private handleToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthenticated = this.authService.authenticatedUser;

    if (isAuthenticated) {
      const token = this.authService.getToken();
      const JWT = `Bearer ${token}`;

      req = req.clone({
        setHeaders: {
          Authorization: JWT,
        },
      });

      return next.handle(req);
    }

    return next.handle(req);
  }
}
