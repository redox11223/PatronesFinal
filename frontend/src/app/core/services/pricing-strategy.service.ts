import { Injectable } from '@angular/core';

export interface PricingStrategy {
  type: 'STANDARD' | 'DISCOUNT' | 'DYNAMIC';
  discountPercentage?: number;
  demandIncrease?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PricingStrategyService {
  private readonly STORAGE_KEY = 'pricingStrategy';

  constructor() {}

  saveStrategy(strategy: PricingStrategy): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(strategy));
  }

  getStrategy(): PricingStrategy {
    const strategyStr = localStorage.getItem(this.STORAGE_KEY);
    if (!strategyStr) {
      return { type: 'STANDARD' };
    }
    return JSON.parse(strategyStr);
  }

  clearStrategy(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  calculatePrice(basePrice: number, applyStrategy: boolean): number {
    if (!applyStrategy) {
      return basePrice;
    }

    const strategy = this.getStrategy();

    switch (strategy.type) {
      case 'DISCOUNT':
        const discount = strategy.discountPercentage || 10;
        return basePrice * (1 - discount / 100);

      case 'DYNAMIC':
        if (strategy.demandIncrease) {
          const increase = parseFloat(strategy.demandIncrease.replace('+', ''));
          return basePrice * (1 + increase / 100);
        }
        return basePrice;

      case 'STANDARD':
      default:
        return basePrice;
    }
  }

  getStrategyDescription(): string {
    const strategy = this.getStrategy();

    switch (strategy.type) {
      case 'DISCOUNT':
        return `Descuento ${strategy.discountPercentage || 10}%`;
      case 'DYNAMIC':
        return `Alta demanda ${strategy.demandIncrease || '+0%'}`;
      case 'STANDARD':
      default:
        return 'Precio Estándar';
    }
  }

  getDiscountOrIncreasePercentage(): number {
    const strategy = this.getStrategy();

    switch (strategy.type) {
      case 'DISCOUNT':
        return -(strategy.discountPercentage || 10);
      case 'DYNAMIC':
        if (strategy.demandIncrease) {
          return parseFloat(strategy.demandIncrease.replace('+', ''));
        }
        return 0;
      case 'STANDARD':
      default:
        return 0;
    }
  }
}
