import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewChatDialogComponent } from '../components/new-chat-dialog/new-chat-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class NewChatDialogService {
  private readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(NewChatDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
}
