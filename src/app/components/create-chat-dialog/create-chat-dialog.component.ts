import { Component, inject, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ChatService } from '../../chat.service';
export interface DialogData {
  name: string;
  participants: string[];
}

@Component({
  selector: 'app-create-chat-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-chat-dialog.component.html',
  styleUrl: './create-chat-dialog.component.scss',
})
export class CreateChatDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateChatDialogComponent>);
  readonly chatService = inject(ChatService);
  readonly data = model<DialogData>({
    name: '',
    participants: [],
  });
  readonly userList = ['User1', 'User2', 'User3'];

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    const data = this.data();
    if (data.name && data.participants.length) {
      try {
        await this.chatService.createChat(data);
        this.dialogRef.close();
      } catch {
        //
      }
    }
  }
}
