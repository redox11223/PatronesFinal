import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductoService } from '../../core/services/producto.service';
import { PedidoService } from '../../core/services/pedido.service';
import { Producto, ProductoCategorias } from '../../core/models/producto.model';
import { Pedido, PedidoDetalle, Usuario } from '../../core/models/pedido.model';

interface ItemPedido {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface UsuarioSimple {
  id: number;
  nombre: string;
  email?: string;
}

@Component({
  selector: 'app-catalogo',
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    TagModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  itemsPedido: ItemPedido[] = [];
  usuarios: UsuarioSimple[] = [];
  
  selectedCategoria?: ProductoCategorias;
  selectedUsuario?: UsuarioSimple;
  
  total = 0;
  loading = false;
  
  categorias = [
    { label: 'Todas', value: undefined },
    { label: 'Periféricos', value: ProductoCategorias.PERIFERICOS },
    { label: 'Almacenamiento', value: ProductoCategorias.ALMACENAMIENTO },
    { label: 'Redes', value: ProductoCategorias.REDES },
    { label: 'Laptops', value: ProductoCategorias.LAPTOPS }
  ];

  constructor(
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProductos();
    this.loadUsuarios();
  }

  loadProductos(): void {
    this.loading = true;
    this.productoService.getAll(0, 100, 'nombre', this.selectedCategoria).subscribe({
      next: (response) => {
        this.productos = response.data.content.filter(p => p.stock > 0);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.loading = false;
      }
    });
  }

  loadUsuarios(): void {
    this.usuarios = [
      { id: 1, nombre: 'Usuario Demo 1', email: 'usuario1@demo.com' },
      { id: 2, nombre: 'Usuario Demo 2', email: 'usuario2@demo.com' },
      { id: 3, nombre: 'Usuario Demo 3', email: 'usuario3@demo.com' }
    ];
  }

  filterByCategoria(): void {
    this.loadProductos();
  }

  agregarAlPedido(producto: Producto): void {
    const existe = this.itemsPedido.find(item => item.producto.id === producto.id);
    
    if (existe) {
      if (existe.cantidad < producto.stock) {
        existe.cantidad++;
        existe.subtotal = existe.cantidad * producto.precio;
      }
    } else {
      this.itemsPedido.push({
        producto: producto,
        cantidad: 1,
        subtotal: producto.precio
      });
    }
    
    this.calcularTotal();
  }

  actualizarCantidad(item: ItemPedido): void {
    if (item.cantidad > 0 && item.cantidad <= item.producto.stock) {
      item.subtotal = item.cantidad * item.producto.precio;
      this.calcularTotal();
    }
  }

  eliminarItem(item: ItemPedido): void {
    this.itemsPedido = this.itemsPedido.filter(i => i !== item);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.itemsPedido.reduce((sum, item) => sum + item.subtotal, 0);
  }

  crearPedido(): void {
    if (!this.selectedUsuario || this.itemsPedido.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione un usuario y agregue productos al pedido'
      });
      return;
    }

    const usuario: Usuario = {
      id: this.selectedUsuario.id,
      nombre: this.selectedUsuario.nombre,
      email: this.selectedUsuario.email
    };

    const detalles: PedidoDetalle[] = this.itemsPedido.map(item => ({
      producto: item.producto,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      subtotal: item.subtotal
    }));

    const pedido: Partial<Pedido> = {
      usuario: usuario,
      detalles: detalles
    };
    
    this.pedidoService.create(pedido as Pedido).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Pedido #${response.data.id} creado correctamente`
        });
        this.limpiarPedido();
      },
      error: (err) => {
        console.error('Error creando pedido:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Error al crear el pedido'
        });
      }
    });
  }

  limpiarPedido(): void {
    this.itemsPedido = [];
    this.selectedUsuario = undefined;
    this.total = 0;
  }

  getSeverity(stock: number): 'success' | 'warn' | 'danger' {
    if (stock > 10) return 'success';
    if (stock > 0) return 'warn';
    return 'danger';
  }
}
