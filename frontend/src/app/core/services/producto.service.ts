import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductoPage, ApiResponse, ProductoCategorias } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/v1/productos';

  constructor(private http: HttpClient) {}

  getAll(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    categoria?: ProductoCategorias,
    precioMin?: number,
    precioMax?: number
  ): Observable<ApiResponse<ProductoPage>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    if (categoria) {
      params = params.set('categoria', categoria);
    }
    if (precioMin !== undefined && precioMin !== null) {
      params = params.set('precioMin', precioMin.toString());
    }
    if (precioMax !== undefined && precioMax !== null) {
      params = params.set('precioMax', precioMax.toString());
    }

    return this.http.get<ApiResponse<ProductoPage>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Producto>> {
    return this.http.get<ApiResponse<Producto>>(`${this.apiUrl}/${id}`);
  }

  create(producto: Producto): Observable<ApiResponse<Producto>> {
    return this.http.post<ApiResponse<Producto>>(this.apiUrl, producto);
  }

  update(id: number, producto: Producto): Observable<ApiResponse<Producto>> {
    return this.http.put<ApiResponse<Producto>>(`${this.apiUrl}/${id}`, producto);
  }

  changeState(id: number, estado: string): Observable<ApiResponse<Producto>> {
    return this.http.patch<ApiResponse<Producto>>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
