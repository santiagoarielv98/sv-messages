import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from '../components/auth-dialog/auth-dialog.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthDialogService {
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  constructor() {
    this.authService.currentUser$.subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        this.openDialog();
      } else {
        this.dialog.closeAll();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      disableClose: true,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
}
