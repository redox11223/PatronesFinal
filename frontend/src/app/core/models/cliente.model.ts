export interface Cliente {
  id?: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaCreacion?: string;
}

export interface ClientePage {
  content: Cliente[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
