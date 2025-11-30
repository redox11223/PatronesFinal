import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { TimelineModule } from 'primeng/timeline';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PedidoService } from '../../core/services/pedido.service';
import { Pedido, EstadoPedido, HistorialEstado } from '../../core/models/pedido.model';

@Component({
  selector: 'app-pedidos',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    TagModule,
    SelectModule,
    TimelineModule,
    ConfirmDialogModule,
    TooltipModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  selectedPedido?: Pedido;
  expandedPedidoId?: number;
  
  loading = false;
  
  // Filtro de estado (backend soporta filtro por estado)
  selectedEstado?: EstadoPedido;
  
  // Estados según backend - NO MODIFICAR
  estados = [
    { label: 'Todos', value: undefined },
    { label: 'Pendiente', value: EstadoPedido.PENDIENTE },
    { label: 'En Proceso', value: EstadoPedido.EN_PROCESO },
    { label: 'Completado', value: EstadoPedido.COMPLETADO },
    { label: 'Cancelado', value: EstadoPedido.CANCELADO }
  ];

  constructor(
    private pedidoService: PedidoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.loading = true;
    
    this.pedidoService.getAll(this.selectedEstado).subscribe({
      next: (response) => {
        this.pedidos = response.data;
        this.pedidosFiltrados = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al cargar los pedidos' 
        });
        this.loading = false;
      }
    });
  }

  filterByEstado(): void {
    this.loadPedidos();
  }

  clearFilters(): void {
    this.selectedEstado = undefined;
    this.loadPedidos();
  }

  cancelarPedido(pedido: Pedido): void {
    // Validaciones según lógica del backend
    if (pedido.estado === EstadoPedido.COMPLETADO) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'No se puede cancelar un pedido completado' 
      });
      return;
    }

    if (pedido.estado === EstadoPedido.CANCELADO) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'El pedido ya está cancelado' 
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de cancelar el pedido #${pedido.id}? El stock de los productos será devuelto.`,
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        this.pedidoService.cancelar(pedido.id!).subscribe({
          next: (response) => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Éxito', 
              detail: 'Pedido cancelado correctamente. Stock devuelto.' 
            });
            this.loadPedidos();
          },
          error: (err) => {
            console.error('Error cancelando pedido:', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: err.error?.message || 'Error al cancelar el pedido' 
            });
          }
        });
      }
    });
  }

  getSeverity(estado: EstadoPedido): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (estado) {
      case EstadoPedido.COMPLETADO:
        return 'success';
      case EstadoPedido.EN_PROCESO:
        return 'info';
      case EstadoPedido.PENDIENTE:
        return 'warn';
      case EstadoPedido.CANCELADO:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getEstadoLabel(estado: EstadoPedido): string {
    const labels: { [key in EstadoPedido]: string } = {
      [EstadoPedido.PENDIENTE]: 'Pendiente',
      [EstadoPedido.EN_PROCESO]: 'En Proceso',
      [EstadoPedido.COMPLETADO]: 'Completado',
      [EstadoPedido.CANCELADO]: 'Cancelado'
    };
    return labels[estado] || estado;
  }

  getHistorialMock(pedido: Pedido): HistorialEstado[] {
    // Mock data - historial simplificado según estados del backend
    const historial: HistorialEstado[] = [
      { estado: EstadoPedido.PENDIENTE, fecha: pedido.fechaCreacion || '' }
    ];

    if (pedido.estado === EstadoPedido.EN_PROCESO || 
        pedido.estado === EstadoPedido.COMPLETADO) {
      historial.push({ 
        estado: EstadoPedido.EN_PROCESO, 
        fecha: pedido.fechaActualizacion || '' 
      });
    }

    if (pedido.estado === EstadoPedido.COMPLETADO) {
      historial.push({ 
        estado: EstadoPedido.COMPLETADO, 
        fecha: pedido.fechaActualizacion || '' 
      });
    }

    if (pedido.estado === EstadoPedido.CANCELADO) {
      historial.push({ 
        estado: EstadoPedido.CANCELADO, 
        fecha: pedido.fechaActualizacion || ''
      });
    }

    return historial;
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUsuarioNombre(pedido: Pedido): string {
    return pedido.usuario?.nombre || `Usuario #${pedido.usuario?.id}`;
  }
}
