import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private readonly snackBar: MatSnackBar) {}

  public openSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', { panelClass: 'snackbar-success' });
  }

  public openErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', { panelClass: 'snackbar-error' });
  }
}
