export enum ProductoCategorias {
  PERIFERICOS = 'PERIFERICOS',
  ALMACENAMIENTO = 'ALMACENAMIENTO',
  REDES = 'REDES',
  LAPTOPS = 'LAPTOPS'
}

export enum ProductoEstado {
  DISPONIBLE = 'DISPONIBLE',
  AGOTADO = 'AGOTADO',
  DESCONTINUADO = 'DESCONTINUADO'
}

export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: ProductoCategorias;
  estado?: ProductoEstado;
  descripcion?: string;
  stockminimo?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface ProductoPage {
  content: Producto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp?: string;
}
