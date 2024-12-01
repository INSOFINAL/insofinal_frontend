import { CanActivateFn, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(ServiceService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.getRoleFromToken() === 'ADMIN') {
    return true;  
  } else {
    return router.navigate(['/home']);  
  }
};
