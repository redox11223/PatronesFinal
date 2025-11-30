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

  /**
   * Obtiene todos los pedidos (sin paginación según backend actual)
   * Filtros opcionales: estado
   */
  getAll(estado?: EstadoPedido): Observable<ApiResponse<Pedido[]>> {
    if (estado) {
      return this.http.get<ApiResponse<Pedido[]>>(`${this.apiUrl}/estado/${estado}`);
    }
    return this.http.get<ApiResponse<Pedido[]>>(this.apiUrl);
  }

  /**
   * Obtiene pedidos por usuario ID
   */
  getByUsuarioId(usuarioId: number): Observable<ApiResponse<Pedido[]>> {
    return this.http.get<ApiResponse<Pedido[]>>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  /**
   * Obtiene pedidos por estado
   */
  getByEstado(estado: EstadoPedido): Observable<ApiResponse<Pedido[]>> {
    return this.http.get<ApiResponse<Pedido[]>>(`${this.apiUrl}/estado/${estado}`);
  }

  /**
   * Obtiene un pedido por ID
   */
  getById(id: number): Observable<ApiResponse<Pedido>> {
    return this.http.get<ApiResponse<Pedido>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo pedido
   */
  create(pedido: Pedido): Observable<ApiResponse<Pedido>> {
    return this.http.post<ApiResponse<Pedido>>(this.apiUrl, pedido);
  }

  /**
   * Actualiza un pedido (solo estado y descuento según backend)
   */
  update(id: number, pedido: Partial<Pedido>): Observable<ApiResponse<Pedido>> {
    return this.http.put<ApiResponse<Pedido>>(`${this.apiUrl}/${id}`, pedido);
  }

  /**
   * Cancela un pedido (único endpoint de cambio de estado disponible)
   */
  cancelar(id: number): Observable<ApiResponse<Pedido>> {
    return this.http.patch<ApiResponse<Pedido>>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  /**
   * Elimina un pedido (si el backend lo implementa)
   */
  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
