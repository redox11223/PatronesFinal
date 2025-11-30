import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductoService } from '../../core/services/producto.service';
import { Producto, ProductoCategorias, ProductoEstado } from '../../core/models/producto.model';

@Component({
  selector: 'app-inventario',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DialogModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputNumberModule,
    RadioButtonModule,
    SelectModule,
    TextareaModule,
    IconFieldModule,
    InputIconModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  selectedProductos: Producto[] = [];
  producto: Producto = this.getEmptyProducto();
  
  productDialog = false;
  submitted = false;
  loading = false;
  
  categorias = [
    { label: 'Periféricos', value: ProductoCategorias.PERIFERICOS },
    { label: 'Almacenamiento', value: ProductoCategorias.ALMACENAMIENTO },
    { label: 'Redes', value: ProductoCategorias.REDES },
    { label: 'Laptops', value: ProductoCategorias.LAPTOPS }
  ];
  
  estados = [
    { label: 'Disponible', value: ProductoEstado.DISPONIBLE },
    { label: 'Agotado', value: ProductoEstado.AGOTADO },
    { label: 'Descontinuado', value: ProductoEstado.DESCONTINUADO }
  ];

  constructor(
    private productoService: ProductoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.loading = true;
    this.productoService.getAll(0, 1000, 'id').subscribe({
      next: (response) => {
        this.productos = response.data.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.loading = false;
      }
    });
  }

  openNew(): void {
    this.producto = this.getEmptyProducto();
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(producto: Producto): void {
    this.producto = { ...producto };
    this.productDialog = true;
  }

  deleteProduct(producto: Producto): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar ${producto.nombre}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Eliminar producto:', producto.id);
        // TODO: Implementar eliminación
      }
    });
  }

  deleteSelectedProducts(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar los productos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Eliminar productos:', this.selectedProductos);
        // TODO: Implementar eliminación múltiple
      }
    });
  }

  hideDialog(): void {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct(): void {
    this.submitted = true;

    if (!this.producto.nombre || !this.producto.precio || !this.producto.stock) {
      return;
    }

    if (this.producto.id) {
      // Actualizar
      this.productoService.update(this.producto.id, this.producto).subscribe({
        next: () => {
          this.loadProductos();
          this.hideDialog();
        },
        error: (err) => console.error('Error actualizando:', err)
      });
    } else {
      // Crear
      this.productoService.create(this.producto).subscribe({
        next: () => {
          this.loadProductos();
          this.hideDialog();
        },
        error: (err) => console.error('Error creando:', err)
      });
    }
  }

  exportCSV(event: any): void {
    console.log('Exportar CSV', event);
    // TODO: Implementar exportación
  }

  getSeverity(estado: string): 'success' | 'warn' | 'danger' {
    switch (estado) {
      case 'DISPONIBLE':
        return 'success';
      case 'AGOTADO':
        return 'warn';
      case 'DESCONTINUADO':
        return 'danger';
      default:
        return 'warn';
    }
  }

  getEmptyProducto(): Producto {
    return {
      nombre: '',
      precio: 0,
      stock: 0,
      categoria: ProductoCategorias.PERIFERICOS,
      estado: ProductoEstado.DISPONIBLE,
      descripcion: '',
      stockminimo: 0
    };
  }
}
