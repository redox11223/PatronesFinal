import { Producto } from './producto.model';
import { Cliente } from './cliente.model';

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}

export interface PedidoDetalle {
  id?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: Producto;
}

export interface Usuario {
  id: number;
  nombre: string;
  email?: string;
}

export interface Pedido {
  id?: number;
  total: number;
  estado: EstadoPedido;
  usuario: Usuario;
  cliente: Cliente;
  detalles: PedidoDetalle[];
  descuento?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

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
