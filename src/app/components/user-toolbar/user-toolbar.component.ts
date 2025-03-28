import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { NewChatDialogService } from '../../services/new-chat-dialog.service';

@Component({
  selector: 'app-user-toolbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, AsyncPipe],
  templateUrl: './user-toolbar.component.html',
  styleUrl: './user-toolbar.component.scss',
})
export class UserToolbarComponent {
  private readonly authService = inject(AuthService);
  private readonly newChatDialogService = inject(NewChatDialogService);

  user$ = this.authService.getCurrentUser();
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }

  openNewChatDialog() {
    this.newChatDialogService.openDialog();
  }
}
