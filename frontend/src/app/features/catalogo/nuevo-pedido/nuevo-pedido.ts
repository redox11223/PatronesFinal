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
import { ClienteService } from '../../../core/services/cliente.service';
import { PricingStrategyService } from '../../../core/services/pricing-strategy.service';
import { Pedido, PedidoDetalle, EstadoPedido, Usuario } from '../../../core/models/pedido.model';
import { MetodoPago } from '../../../core/models/metodo-pago.model';
import { Cliente } from '../../../core/models/cliente.model';

interface ItemPedido {
  producto: any;
  cantidad: number;
  subtotal: number;
}

interface PreOrden {
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
  selectedCliente?: Cliente;
  clientes: Cliente[] = [];
  metodoPago?: string;
  aplicarEstrategia = false;
  descuentoMonto = 0;
  loading = false;
  metodosPago: MetodoPago[] = [];

  constructor(
    private router: Router,
    private pedidoService: PedidoService,
    private metodoPagoService: MetodoPagoService,
    private clienteService: ClienteService,
    private pricingStrategyService: PricingStrategyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPreOrden();
    this.loadMetodosPago();
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getAll(0, 100, 'nombre').subscribe({
      next: (response) => {
        this.clientes = response.data;
        
        if (!this.clientes || this.clientes.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'No hay clientes registrados en el sistema'
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes: ' + (err.error?.message || err.message)
        });
      }
    });
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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los métodos de pago'
        });
      }
    });
  }

  get estrategiaPrecio(): string {
    return this.pricingStrategyService.getStrategyDescription();
  }

  get totalFinal(): number {
    if (!this.preOrden) return 0;
    
    if (!this.aplicarEstrategia) {
      return this.preOrden.total;
    }

    const percentage = this.pricingStrategyService.getDiscountOrIncreasePercentage();
    const adjustment = this.preOrden.total * (percentage / 100);
    return this.preOrden.total + adjustment;
  }

  get adjustmentAmount(): number {
    if (!this.preOrden || !this.aplicarEstrategia) return 0;
    const percentage = this.pricingStrategyService.getDiscountOrIncreasePercentage();
    return this.preOrden.total * (percentage / 100);
  }

  get isDiscount(): boolean {
    return this.adjustmentAmount < 0;
  }

  onEstrategiaChange(): void {
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
    if (!this.preOrden || !this.selectedCliente) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un cliente'
      });
      return;
    }

    this.loading = true;

    const usuario: Usuario = {
      id: 1,
      nombre: this.selectedCliente.nombre,
      email: undefined
    };

    const cliente: Cliente = {
      id: this.selectedCliente.id,
      nombre: this.selectedCliente.nombre
    };

    // Detalles del pedido
    const detalles: PedidoDetalle[] = this.preOrden.items.map(item => ({
      producto: { id: item.producto.id } as any,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      subtotal: item.subtotal
    }));

    const totalSinDescuento = this.preOrden.total;
    const descuentoAplicado = this.aplicarEstrategia ? Math.abs(this.adjustmentAmount) : 0;
    const totalFinal = totalSinDescuento - descuentoAplicado;

    const pedido: Pedido = {
      total: totalFinal,
      estado: EstadoPedido.PENDIENTE,
      usuario: usuario,
      cliente: cliente,
      detalles: detalles,
      descuento: descuentoAplicado
    };

    this.pedidoService.create(pedido).subscribe({
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
        let errorMessage = 'Error al procesar el pedido';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.error?.errors) {
          const validationErrors = err.error.errors;
          errorMessage = Object.values(validationErrors).join(', ');
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
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
