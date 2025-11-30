import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout.component').then(m => m.MainLayoutComponent),
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
      }
    ]
  }
];
