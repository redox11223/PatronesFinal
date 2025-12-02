import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { PricingStrategyService } from '../../../core/services/pricing-strategy.service';

@Component({
  selector: 'app-pricing-strategies',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    RadioButtonModule,
    InputTextModule,
    SelectButtonModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './pricing-strategies.html',
  styleUrl: './pricing-strategies.css'
})
export class PricingStrategies implements OnInit {
  selectedStrategy: string = 'STANDARD';
  discountPercentage: number = 10;
  selectedDemand: string = '';
  canEdit = false;
  
  demandOptions = [
    { label: '+5%', value: '+5' },
    { label: '+10%', value: '+10' },
    { label: '+15%', value: '+15' },
    { label: '+20%', value: '+20' },
    { label: '+25%', value: '+25' }
  ];

  constructor(
    private authService: AuthService,
    private pricingStrategyService: PricingStrategyService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const rol = this.authService.getCurrentRol();
    this.canEdit = rol === 'ADMIN' || rol === 'GERENTE';
    this.loadSavedStrategy();
  }

  loadSavedStrategy() {
    const strategy = this.pricingStrategyService.getStrategy();
    this.selectedStrategy = strategy.type;
    if (strategy.discountPercentage) {
      this.discountPercentage = strategy.discountPercentage;
    }
    if (strategy.demandIncrease) {
      this.selectedDemand = strategy.demandIncrease;
    }
  }

  saveStrategy() {
    if (!this.canEdit) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Acceso Denegado',
        detail: 'No tiene permisos para guardar estrategias'
      });
      return;
    }

    const strategy: any = {
      type: this.selectedStrategy
    };

    if (this.selectedStrategy === 'DISCOUNT') {
      strategy.discountPercentage = this.discountPercentage;
    } else if (this.selectedStrategy === 'DYNAMIC') {
      if (!this.selectedDemand) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validación',
          detail: 'Seleccione un porcentaje de aumento para precio dinámico'
        });
        return;
      }
      strategy.demandIncrease = this.selectedDemand;
    }

    this.pricingStrategyService.saveStrategy(strategy);
    this.messageService.add({
      severity: 'success',
      summary: 'Guardado',
      detail: 'Estrategia de precio guardada correctamente'
    });
  }
}
