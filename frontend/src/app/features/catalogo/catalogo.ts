import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ProductoService } from '../../core/services/producto.service';
import { Producto, ProductoCategorias, ProductoEstado } from '../../core/models/producto.model';

interface ItemPedido {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-catalogo',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    TagModule,
    CardModule,
    ToastModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  itemsPedido: ItemPedido[] = [];
  
  selectedCategoria?: ProductoCategorias;
  
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
    private messageService: MessageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadProductos();
    }, 0);
  }

  loadProductos(): void {
    this.loading = true;
    this.productoService.getAll(0, 100, 'nombre', this.selectedCategoria).subscribe({
      next: (response) => {
        console.log('Productos recibidos:', response.data.content);
        const todosLosProductos = response.data.content;
        this.productos = todosLosProductos.filter(p => 
          p.stock > 0 && p.estado === ProductoEstado.DISPONIBLE
        );
        console.log('Productos filtrados:', this.productos);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
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
    if (this.itemsPedido.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Agregue productos al pedido'
      });
      return;
    }

    const preOrden = {
      items: this.itemsPedido,
      total: this.total
    };

    localStorage.setItem('preOrden', JSON.stringify(preOrden));
    this.router.navigate(['/catalog/new-order']);
  }

  limpiarPedido(): void {
    this.itemsPedido = [];
    this.total = 0;
  }

  getSeverity(stock: number): 'success' | 'warn' | 'danger' {
    if (stock > 10) return 'success';
    if (stock > 0) return 'warn';
    return 'danger';
  }
}
