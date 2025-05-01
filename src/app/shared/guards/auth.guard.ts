import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }

      const snackbarService = inject(SnackbarService);
      snackbarService.openErrorSnackbar('Access denied');
      router.navigate(['/login']);
      return false;
    })
  );
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const snackbarService = inject(SnackbarService);

  return authService.currentUser().pipe(
    take(1),
    map(user => {
      if (user && user.role === 'ADMIN') {
        return true;
      }

      snackbarService.openErrorSnackbar('Access denied');
      router.navigate(['/login']);
      return false;
    })
  );
};

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const snackbarService = inject(SnackbarService);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (!user) {
        return true;
      }

      snackbarService.openErrorSnackbar('Already authenticated');
      router.navigate(['/home']);
      return false;
    })
  );
};
