import { PaginatedRequest } from './../../models/request/paginated-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';

@Injectable()
export class BaseService {

  private headers!: HttpHeaders;
  private baseUrl: string = environment.apiUrl;

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

  protected getPaginationParams(request: PaginatedRequest, filterCol: string = '', includes: Array<string> = []): HttpParams {
    const sortOrder = request.sortOrder === 'desc' ? '-' : '';
    const filter = filterCol && filterCol.length ? filterCol : 'all';
    let params = new HttpParams()
      .append(`filter[${filter}]`, request.filter)
      .append('page[size]', request.pageSize)
      .append('page[number]', request.page)
      .append('sort', `${sortOrder}${request.sort}`);

    if (includes && includes.length) {
      params = params.append('include', includes.join(','));
    }

    return params;
  }

  private setHeaders() {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest');
  }
}
