import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/rest/auth.service";
import { Observable, catchError, throwError } from "rxjs";
import { MessageService } from "primeng/api";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService, private _messageService: MessageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {

        if (err.status === 403) {
          this._messageService.add({
            severity: 'error',
            summary: 'No autorizado!',
            detail: 'Acción no autorizada, por favor contactese con el administrador.'
          });
        }

        if (err.status === 401) {
          this._messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'Sesión expirada, inicie sesión nuevamente...'
          });
          this._authService.cleanSession();
          location.reload();
        }

        return throwError(() => err);
      }));
  }
}
