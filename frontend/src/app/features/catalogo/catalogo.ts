import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProductoService } from '../../core/services/producto.service';
import { Producto, ProductoCategorias } from '../../core/models/producto.model';

interface ItemPedido {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface Cliente {
  id: number;
  nombre: string;
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
    CardModule
  ],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  itemsPedido: ItemPedido[] = [];
  clientes: Cliente[] = [];
  
  selectedCategoria?: ProductoCategorias;
  selectedCliente?: Cliente;
  
  total = 0;
  loading = false;
  
  categorias = [
    { label: 'Todas', value: undefined },
    { label: 'Periféricos', value: ProductoCategorias.PERIFERICOS },
    { label: 'Almacenamiento', value: ProductoCategorias.ALMACENAMIENTO },
    { label: 'Redes', value: ProductoCategorias.REDES },
    { label: 'Laptops', value: ProductoCategorias.LAPTOPS }
  ];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.loadProductos();
    this.loadClientes();
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

  loadClientes(): void {
    // TODO: Implementar cuando esté el servicio de clientes
    this.clientes = [
      { id: 1, nombre: 'Cliente Demo 1' },
      { id: 2, nombre: 'Cliente Demo 2' },
      { id: 3, nombre: 'Cliente Demo 3' }
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
    if (!this.selectedCliente || this.itemsPedido.length === 0) {
      return;
    }

    const pedido = {
      clienteId: this.selectedCliente.id,
      items: this.itemsPedido.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        precio: item.producto.precio
      })),
      total: this.total
    };
    
    console.log('Crear pedido:', pedido);
    // TODO: Implementar servicio de pedidos
    // this.pedidoService.create(pedido).subscribe(...)
  }

  limpiarPedido(): void {
    this.itemsPedido = [];
    this.selectedCliente = undefined;
    this.total = 0;
  }

  getSeverity(stock: number): 'success' | 'warn' | 'danger' {
    if (stock > 10) return 'success';
    if (stock > 0) return 'warn';
    return 'danger';
  }
}
