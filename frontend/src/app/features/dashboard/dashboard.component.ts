import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="dashboard-container">
      <h2>Dashboard Principal</h2>
      <p>Bienvenido a TechSolutions</p>
      
      <div class="dashboard-empty">
        <p>Este es el dashboard principal en blanco.</p>
        <p>Aquí se mostrarán los KPIs y estadísticas del sistema.</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem;
    }

    .dashboard-container h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .dashboard-empty {
      margin-top: 2rem;
      padding: 2rem;
      border: 2px dashed #e5e7eb;
      border-radius: 0.5rem;
      text-align: center;
      color: #6b7280;
    }

    .dashboard-empty p {
      margin: 0.5rem 0;
    }
  `]
})
export class DashboardComponent {}
