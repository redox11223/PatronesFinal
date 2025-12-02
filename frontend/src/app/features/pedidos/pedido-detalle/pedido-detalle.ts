import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido, EstadoPedido, PedidoDetalle } from '../../../core/models/pedido.model';
import { Producto, ProductoCategorias } from '../../../core/models/producto.model';

@Component({
  selector: 'app-pedido-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './pedido-detalle.html',
  styleUrl: './pedido-detalle.css'
})
export class PedidoDetalleComponent implements OnInit {
  pedido?: Pedido;
  loading = false;
  
  selectedProducto?: string;
  selectedCategoria?: ProductoCategorias;
  
  productos: { label: string; value: string }[] = [];
  categorias = [
    { label: 'Todas', value: undefined },
    { label: 'Periféricos', value: ProductoCategorias.PERIFERICOS },
    { label: 'Almacenamiento', value: ProductoCategorias.ALMACENAMIENTO },
    { label: 'Redes', value: ProductoCategorias.REDES },
    { label: 'Laptops', value: ProductoCategorias.LAPTOPS }
  ];

  historialAcciones: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPedido(+id);
    } else {
      this.router.navigate(['/orders']);
    }
  }

  loadPedido(id: number): void {
    this.loading = true;
    
    this.pedidoService.getById(id).subscribe({
      next: (response) => {
        this.pedido = response.data;
        this.loading = false;
        
        if (this.pedido.detalles) {
          this.productos = [
            { label: 'Todos', value: '' },
            ...this.pedido.detalles.map(d => ({
              label: d.producto?.nombre || `Producto #${d.producto?.id}`,
              value: d.producto?.nombre || ''
            }))
          ];
        }
        
        this.generateHistorialMock();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando pedido:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el pedido'
        });
        this.loading = false;
        this.router.navigate(['/orders']);
      }
    });
  }

  generateHistorialMock(): void {
    if (!this.pedido) return;
    
    this.historialAcciones = [
      {
        fecha: this.pedido.fechaCreacion,
        usuario: this.pedido.usuario.nombre,
        accion: 'Pedido creado',
        detalle: `Estado: ${this.getEstadoLabel(EstadoPedido.PENDIENTE)}`
      }
    ];

    if (this.pedido.estado === EstadoPedido.EN_PROCESO || 
        this.pedido.estado === EstadoPedido.COMPLETADO) {
      this.historialAcciones.push({
        fecha: this.pedido.fechaActualizacion,
        usuario: this.pedido.usuario.nombre,
        accion: 'Estado actualizado',
        detalle: `Cambio a: ${this.getEstadoLabel(EstadoPedido.EN_PROCESO)}`
      });
    }

    if (this.pedido.estado === EstadoPedido.COMPLETADO) {
      this.historialAcciones.push({
        fecha: this.pedido.fechaActualizacion,
        usuario: this.pedido.usuario.nombre,
        accion: 'Pedido completado',
        detalle: `Estado: ${this.getEstadoLabel(EstadoPedido.COMPLETADO)}`
      });
    }

    if (this.pedido.estado === EstadoPedido.CANCELADO) {
      this.historialAcciones.push({
        fecha: this.pedido.fechaActualizacion,
        usuario: this.pedido.usuario.nombre,
        accion: 'Pedido cancelado',
        detalle: 'Stock devuelto al inventario'
      });
    }
  }

  get detallesFiltrados(): PedidoDetalle[] {
    if (!this.pedido?.detalles) return [];
    
    let detalles = [...this.pedido.detalles];
    
    if (this.selectedProducto) {
      detalles = detalles.filter(d => 
        d.producto?.nombre?.toLowerCase().includes(this.selectedProducto!.toLowerCase())
      );
    }
    
    if (this.selectedCategoria) {
      detalles = detalles.filter(d => 
        d.producto?.categoria === this.selectedCategoria
      );
    }
    
    return detalles;
  }

  cancelarPedido(): void {
    if (!this.pedido) return;

    if (this.pedido.estado === EstadoPedido.COMPLETADO) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se puede cancelar un pedido completado'
      });
      return;
    }

    if (this.pedido.estado === EstadoPedido.CANCELADO) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El pedido ya está cancelado'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de cancelar el pedido #${this.pedido.id}? El stock será devuelto al inventario.`,
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        this.pedidoService.cancelar(this.pedido!.id!).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Pedido cancelado correctamente. Stock devuelto.'
            });
            this.loadPedido(this.pedido!.id!);
            this.cdr.detectChanges();
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

  volver(): void {
    this.router.navigate(['/orders']);
  }

  getEstadoLabel(estado: EstadoPedido): string {
    const labels: { [key in EstadoPedido]: string } = {
      [EstadoPedido.PENDIENTE]: 'Pendiente',
      [EstadoPedido.EN_PROCESO]: 'Procesado',
      [EstadoPedido.COMPLETADO]: 'Completado',
      [EstadoPedido.CANCELADO]: 'Cancelado'
    };
    return labels[estado] || estado;
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

  formatDate(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstrategiaPrecio(): string {
    if (!this.pedido?.descuento || this.pedido.descuento === 0) {
      return 'Precio estándar';
    }
    
    const porcentaje = (this.pedido.descuento / (this.pedido.total + this.pedido.descuento)) * 100;
    
    if (porcentaje >= 20) return 'Descuento Premium';
    if (porcentaje >= 10) return 'Descuento Especial';
    return 'Descuento Aplicado';
  }
}
