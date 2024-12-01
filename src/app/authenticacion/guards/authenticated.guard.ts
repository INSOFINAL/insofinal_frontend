import { CanActivateFn, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';
import { inject } from '@angular/core';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(ServiceService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const role = authService.getRoleFromToken();

    if (role === 'ADMIN') {
      router.navigate(['/dashboard']);
      return false;
    }else if (role === 'WORKER') {
      router.navigate(['/dashboard-worker']);
      return false;
    } else {
      router.navigate(['/home']);
      return false;
    }
  }

  
  return true;
};
