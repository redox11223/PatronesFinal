import { Producto } from './producto.model';

// Estados del backend - NO MODIFICAR (implementado por otro equipo)
export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}

// PedidoDetalle del backend
export interface PedidoDetalle {
  id?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: Producto;
}

// Usuario simplificado (el backend usa Usuario, no Cliente)
export interface Usuario {
  id: number;
  nombre: string;
  email?: string;
}

// Pedido según entidad del backend
export interface Pedido {
  id?: number;
  total: number;
  estado: EstadoPedido;
  usuario: Usuario; // Backend usa Usuario, no Cliente
  detalles: PedidoDetalle[]; // Backend usa 'detalles', no 'items'
  descuento?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

// Para respuestas paginadas (si el backend las implementa)
export interface PedidoPage {
  content: Pedido[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface HistorialEstado {
  estado: EstadoPedido;
  fecha: string;
}
