import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
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

        if (err.error instanceof Blob) {
          return new Observable<never>(observer => {
            const reader = new FileReader();

            reader.onload = () => {
              try {
                const errorObj = JSON.parse(reader.result as string);
                this.handleError(err.status, errorObj.message);
              } catch (e) {
                this.handleError(err.status);
              }
              observer.error(err);
            };

            reader.onerror = () => {
              this.handleError(err.status);
              observer.error(err);
            };

            reader.readAsText(err.error);
          });
        }


        const message = err.error?.message;
        this.handleError(err.status, message);

        return throwError(() => err);
      })
    );
  }

  private handleError(status: number, message?: string) {
    if (status === 401) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Sesión expirada, inicie sesión nuevamente...'
      });
      this._authService.cleanSession();
      location.reload();
      return;
    }

    if (status === 403) {
      this._messageService.add({
        severity: 'error',
        summary: 'No autorizado!',
        detail: message || 'Acción no autorizada, por favor contactese con el administrador.'
      });
      return;
    }

    if (status === 405) {
      this._messageService.add({
        severity: 'error',
        summary: 'Operación no permitida',
        detail: message || 'No está permitido realizar esta acción.'
      });
      return;
    }

    if (status === 404) {
      this._messageService.add({
        severity: 'error',
        summary: 'No encontrado',
        detail: message || 'El recurso solicitado no fue encontrado.'
      });
      return;
    }

    if (status === 500) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error del servidor',
        detail: message || 'Error interno del servidor.'
      });
      return;
    }

    // Error genérico
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message || 'Ocurrió un error inesperado.'
    });
  }
}
