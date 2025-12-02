import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { MetodoPagoService } from '../../../core/services/metodo-pago.service';
import { MetodoPago } from '../../../core/models/metodo-pago.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payment-gateways',
  imports: [CommonModule, FormsModule, CardModule, CheckboxModule],
  templateUrl: './payment-gateways.html',
  styleUrl: './payment-gateways.css'
})
export class PaymentGateways implements OnInit {
  metodosPago: MetodoPago[] = [];
  canEdit = false;
  
  constructor(
    private metodoPagoService: MetodoPagoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    const rol = this.authService.getCurrentRol();
    this.canEdit = rol === 'ADMIN' || rol === 'GERENTE';
    this.loadMetodosPago();
  }
  
  loadMetodosPago() {
    this.metodoPagoService.getAll().subscribe({
      next: (response) => {
        this.metodosPago = response.data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
  
  onToggle(gateway: MetodoPago) {
    if (!this.canEdit) {
      gateway.activo = !gateway.activo;
      return;
    }
    
    if (gateway.id) {
      this.metodoPagoService.cambiarEstado(gateway.id, gateway.activo).subscribe({
        next: () => {},
        error: () => {
          gateway.activo = !gateway.activo;
        }
      });
    }
  }
}
