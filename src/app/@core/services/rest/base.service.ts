import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from './../../../../environments/environment';

@Injectable()
export class BaseService {

  private headers!: HttpHeaders;
  private baseUrl: env.apiUrl;

  constructor(private _http: HttpClient) { }

  protected get<TResponse>(uri: string, params: HttpParams = new HttpParams()): Observable<TResponse> {
    this.setHeaders();
    return this._http.get<TResponse>(`${this.baseUrl}/${uri}`, {
      headers: this.headers,
      params: params,
    });
  }

  protected post<TResponse>(uri: string, params: any = null): Observable<TResponse> {
    this.setHeaders();
    return this._http.post<TResponse>(`${this.baseUrl}/${uri}`, params, {
      headers: this.headers,
    });
  }

  protected put<TResponse>(uri: string, params: any = null): Observable<TResponse> {
    this.setHeaders();
    return this._http.put<TResponse>(`${this.baseUrl}/${uri}`, params, {
      headers: this.headers,
    });
  }

  protected delete<TResponse>(uri: string): Observable<TResponse> {
    this.setHeaders();
    return this._http.delete<TResponse>(`${this.baseUrl}/${uri}`, {
      headers: this.headers,
    });
  }

  protected handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }

  private setHeaders() {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest');
  }

  protected createParams<TParams>(params: TParams): HttpParams {
    let httpParams = new HttpParams();
    const keys = Object.keys(params);
    keys.forEach((key) => {
      if (params[key]) {
        httpParams = httpParams.set(key, params[key])
      }
    });

    return httpParams;
  }
}
