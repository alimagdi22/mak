import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const UnAuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  if (token) {
    const router = inject(Router);

    router.navigate(['/user-management']);

    return false;
  } else {
    return true;
  }
};
