import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetodoPago } from '../models/metodo-pago.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private apiUrl = 'http://localhost:8080/v1/metodos-pago';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<MetodoPago[]>> {
    return this.http.get<ApiResponse<MetodoPago[]>>(this.apiUrl);
  }

  create(metodoPago: MetodoPago): Observable<ApiResponse<MetodoPago>> {
    return this.http.post<ApiResponse<MetodoPago>>(this.apiUrl, metodoPago);
  }

  cambiarEstado(id: number, activo: boolean): Observable<ApiResponse<MetodoPago>> {
    return this.http.patch<ApiResponse<MetodoPago>>(`${this.apiUrl}/${id}/estado?activo=${activo}`, {});
  }
}
