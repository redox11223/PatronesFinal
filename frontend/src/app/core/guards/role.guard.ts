import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const currentRole = authService.getCurrentRol();
    
    if (currentRole && allowedRoles.includes(currentRole)) {
      return true;
    }
    
    // Redirigir al dashboard si no tiene permiso
    router.navigate(['/dashboard']);
    return false;
  };
};
