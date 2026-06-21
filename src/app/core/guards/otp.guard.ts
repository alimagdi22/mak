import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

export const OtpGuard: CanActivateFn = (route, state) => {
  const sharedService = inject(SharedService);

  if (sharedService.otpAccess) {
    return true;
  } else {
    const router = inject(Router);

    router.navigate(['user-management', 'registration']);

    return false;
  }
};
