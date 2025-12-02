import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, EstadoPedido } from '../models/pedido.model';
import { ApiResponse } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/v1/pedidos';

  constructor(private http: HttpClient) {}

  getAll(estado?: EstadoPedido): Observable<ApiResponse<Pedido[]>> {
    if (estado) {
      return this.http.get<ApiResponse<Pedido[]>>(`${this.apiUrl}/estado/${estado}`);
    }
    return this.http.get<ApiResponse<Pedido[]>>(this.apiUrl);
  }

  getByUsuarioId(usuarioId: number): Observable<ApiResponse<Pedido[]>> {
    return this.http.get<ApiResponse<Pedido[]>>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getByEstado(estado: EstadoPedido): Observable<ApiResponse<Pedido[]>> {
    return this.http.get<ApiResponse<Pedido[]>>(`${this.apiUrl}/estado/${estado}`);
  }

  getById(id: number): Observable<ApiResponse<Pedido>> {
    return this.http.get<ApiResponse<Pedido>>(`${this.apiUrl}/${id}`);
  }

  create(pedido: Pedido): Observable<ApiResponse<Pedido>> {
    return this.http.post<ApiResponse<Pedido>>(this.apiUrl, pedido);
  }

  update(id: number, pedido: Partial<Pedido>): Observable<ApiResponse<Pedido>> {
    return this.http.put<ApiResponse<Pedido>>(`${this.apiUrl}/${id}`, pedido);
  }

  cancelar(id: number): Observable<ApiResponse<Pedido>> {
    return this.http.patch<ApiResponse<Pedido>>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
