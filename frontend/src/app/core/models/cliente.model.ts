export interface Cliente {
  id?: number;
  nombre: string;
}

export interface ClientePage {
  content: Cliente[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
