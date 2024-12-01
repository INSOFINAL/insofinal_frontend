import { CanActivateFn, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';
import { inject } from '@angular/core';

export const workerGuard: CanActivateFn = (route, state) => {
  const authService = inject(ServiceService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.getRoleFromToken() === 'WORKER') {
    return true;  
  } else {
    return router.navigate(['/home']);  
  }
};
