import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./features/inventario/inventario').then(m => m.InventarioComponent)
      },
      {
        path: 'catalog',
        loadComponent: () => import('./features/catalogo/catalogo').then(m => m.CatalogoComponent)
      },
      {
        path: 'catalog/new-order',
        loadComponent: () => import('./features/catalogo/nuevo-pedido/nuevo-pedido').then(m => m.NuevoPedidoComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/pedidos/pedidos').then(m => m.PedidosComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./features/pedidos/pedido-detalle/pedido-detalle').then(m => m.PedidoDetalleComponent)
      },
      {
        path: 'config/payments',
        loadComponent: () => import('./features/config/payment-gateways/payment-gateways').then(m => m.PaymentGateways),
        canActivate: [roleGuard(['ADMIN', 'GERENTE'])]
      },
      {
        path: 'config/pricing',
        loadComponent: () => import('./features/config/pricing-strategies/pricing-strategies').then(m => m.PricingStrategies),
        canActivate: [roleGuard(['ADMIN', 'GERENTE'])]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
