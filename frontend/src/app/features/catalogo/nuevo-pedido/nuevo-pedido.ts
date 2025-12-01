import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PedidoService } from '../../../core/services/pedido.service';
import { MetodoPagoService } from '../../../core/services/metodo-pago.service';
import { Pedido, PedidoDetalle, Usuario, EstadoPedido } from '../../../core/models/pedido.model';
import { MetodoPago } from '../../../core/models/metodo-pago.model';

interface ItemPedido {
  producto: any;
  cantidad: number;
  subtotal: number;
}

interface PreOrden {
  usuario: any;
  items: ItemPedido[];
  total: number;
}

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './nuevo-pedido.html',
  styleUrl: './nuevo-pedido.css'
})
export class NuevoPedidoComponent implements OnInit {
  preOrden?: PreOrden;
  metodoPago?: string;
  aplicarDescuento = false;
  descuentoMonto = 0;
  loading = false;
  metodosPago: MetodoPago[] = [];

  constructor(
    private router: Router,
    private pedidoService: PedidoService,
    private metodoPagoService: MetodoPagoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPreOrden();
    this.loadMetodosPago();
  }

  loadPreOrden(): void {
    const preOrdenStr = localStorage.getItem('preOrden');
    if (!preOrdenStr) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay pedido pendiente'
      });
      this.router.navigate(['/catalog']);
      return;
    }

    this.preOrden = JSON.parse(preOrdenStr);
  }

  loadMetodosPago(): void {
    this.metodoPagoService.getAll().subscribe({
      next: (response) => {
        this.metodosPago = response.data.filter((m: MetodoPago) => m.activo);
      },
      error: (err) => {
        console.error('Error cargando métodos de pago:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los métodos de pago'
        });
      }
    });
  }

  get estrategiaPrecio(): string {
    if (!this.aplicarDescuento || this.descuentoMonto === 0) {
      return 'Precio estándar';
    }

    if (!this.preOrden) return 'Precio estándar';

    const porcentaje = (this.descuentoMonto / this.preOrden.total) * 100;
    
    if (porcentaje >= 20) return 'Descuento Premium';
    if (porcentaje >= 10) return 'Descuento Especial';
    return 'Descuento Aplicado';
  }

  get totalFinal(): number {
    if (!this.preOrden) return 0;
    return this.aplicarDescuento ? this.preOrden.total - this.descuentoMonto : this.preOrden.total;
  }

  onDescuentoChange(): void {
    if (!this.aplicarDescuento) {
      this.descuentoMonto = 0;
    } else {
      if (this.preOrden) {
        this.descuentoMonto = this.preOrden.total * 0.10;
      }
    }
  }

  procesarPedido(): void {
    if (!this.metodoPago) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione un método de pago'
      });
      return;
    }

    if (!this.preOrden) return;

    this.confirmationService.confirm({
      message: '¿Está seguro de procesar este pedido?',
      header: 'Confirmar Procesamiento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, procesar',
      rejectLabel: 'No',
      accept: () => {
        this.confirmarProcesamiento();
      }
    });
  }

  confirmarProcesamiento(): void {
    if (!this.preOrden) return;

    this.loading = true;

    const usuario: Usuario = {
      id: this.preOrden.usuario.id,
      nombre: this.preOrden.usuario.nombre,
      email: this.preOrden.usuario.email
    };

    const detalles: PedidoDetalle[] = this.preOrden.items.map(item => ({
      producto: item.producto,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      subtotal: item.subtotal
    }));

    const pedido: Partial<Pedido> = {
      usuario: usuario,
      detalles: detalles,
      descuento: this.aplicarDescuento ? this.descuentoMonto : 0,
      estado: EstadoPedido.EN_PROCESO
    };

    this.pedidoService.create(pedido as Pedido).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Pedido #${response.data.id} procesado correctamente`
        });
        localStorage.removeItem('preOrden');
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error procesando pedido:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Error al procesar el pedido'
        });
        this.loading = false;
      }
    });
  }

  cancelarPedido(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de cancelar este pedido?',
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        localStorage.removeItem('preOrden');
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Pedido cancelado'
        });
        this.router.navigate(['/catalog']);
      }
    });
  }
}
