import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HlmSidebarImports } from './sidebar/src/index';
import { HlmCollapsibleImports } from './collapsible/src/index';
import { HlmIconImports } from './icon/src/index';
import { provideIcons } from '@ng-icons/core';
import { 
  lucideHome, 
  lucidePackage, 
  lucideShoppingCart, 
  lucideFileText,
  lucideSettings,
  lucideChevronDown,
  lucideMenu
} from '@ng-icons/lucide';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HlmSidebarImports,
    HlmCollapsibleImports,
    HlmIconImports,
  ],
  providers: [
    provideIcons({
      lucideHome,
      lucidePackage,
      lucideShoppingCart,
      lucideFileText,
      lucideSettings,
      lucideChevronDown,
      lucideMenu,
    }),
  ],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader class="border-b">
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <a hlmSidebarMenuButton class="!p-2">
                <ng-icon hlm name="lucidePackage" class="!size-5" />
                <span class="text-base font-semibold">TechSolutions</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div hlmSidebarContent>
          <!-- Dashboard -->
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Principal</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton routerLink="/dashboard">
                    <ng-icon hlm name="lucideHome" />
                    <span>Dashboard</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Gestión (colapsable) -->
          <div hlmSidebarGroup>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <hlm-collapsible [expanded]="true" class="group/collapsible">
                    <button 
                      hlmCollapsibleTrigger 
                      hlmSidebarMenuButton
                      class="w-full"
                    >
                      <span>Gestión</span>
                      <ng-icon 
                        hlm 
                        name="lucideChevronDown" 
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                      />
                    </button>
                    <hlm-collapsible-content>
                      <ul hlmSidebarMenuSub>
                        <li hlmSidebarMenuSubItem>
                          <a hlmSidebarMenuSubButton routerLink="/inventory">
                            <ng-icon hlm name="lucidePackage" size="sm" />
                            <span>Inventario</span>
                          </a>
                        </li>
                        <li hlmSidebarMenuSubItem>
                          <a hlmSidebarMenuSubButton routerLink="/catalog">
                            <ng-icon hlm name="lucideShoppingCart" size="sm" />
                            <span>Catálogo</span>
                          </a>
                        </li>
                        <li hlmSidebarMenuSubItem>
                          <a hlmSidebarMenuSubButton routerLink="/orders">
                            <ng-icon hlm name="lucideFileText" size="sm" />
                            <span>Pedidos</span>
                          </a>
                        </li>
                      </ul>
                    </hlm-collapsible-content>
                  </hlm-collapsible>
                </li>

                <li hlmSidebarMenuItem>
                  <hlm-collapsible [expanded]="false" class="group/collapsible">
                    <button 
                      hlmCollapsibleTrigger 
                      hlmSidebarMenuButton
                      class="w-full"
                    >
                      <span>Configuración</span>
                      <ng-icon 
                        hlm 
                        name="lucideChevronDown" 
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                      />
                    </button>
                    <hlm-collapsible-content>
                      <ul hlmSidebarMenuSub>
                        <li hlmSidebarMenuSubItem>
                          <a hlmSidebarMenuSubButton routerLink="/reports">
                            <ng-icon hlm name="lucideFileText" size="sm" />
                            <span>Reportes</span>
                          </a>
                        </li>
                        <li hlmSidebarMenuSubItem>
                          <a hlmSidebarMenuSubButton routerLink="/config">
                            <ng-icon hlm name="lucideSettings" size="sm" />
                            <span>Configuración</span>
                          </a>
                        </li>
                      </ul>
                    </hlm-collapsible-content>
                  </hlm-collapsible>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div hlmSidebarFooter class="border-t">
          <p class="px-4 py-2 text-sm text-muted-foreground">© 2025 TechSolutions</p>
        </div>
      </hlm-sidebar>

      <main hlmSidebarInset>
        <header class="flex h-16 items-center gap-4 border-b px-6">
          <button hlmSidebarTrigger>
            <span class="sr-only">Toggle Sidebar</span>
          </button>
          <h1 class="text-lg font-semibold">Sistema de Gestión</h1>
        </header>
        
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {}
