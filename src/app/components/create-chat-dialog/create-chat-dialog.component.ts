import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { UserService } from '../../user.service';
import { AsyncPipe } from '@angular/common';

export interface ChatDialogData {
  name: string;
  participants: string[];
}

@Component({
  selector: 'app-create-chat-dialog',
  imports: [
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatListModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-chat-dialog.component.html',
  styleUrl: './create-chat-dialog.component.scss',
})
export class CreateChatDialogComponent {
  dialogRef = inject(MatDialogRef<CreateChatDialogComponent>);
  userService = inject(UserService);
  users$ = this.userService.users$;

  chatForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    participants: new FormArray([new FormControl('', [Validators.required])]),
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelectionChange(event: MatSelectionListChange) {
    const selectedOptions = event.source.selectedOptions.selected.map(
      (o) => o.value as string,
    );

    const participants = this.chatForm.get('participants') as FormArray;
    participants.clear();

    // participants.value
    selectedOptions.forEach((option) => {
      participants.push(new FormControl(option));
    });
  }

  onSubmit() {
    if (this.chatForm.valid) {
      this.dialogRef.close(this.chatForm.value);
    } else {
      this.chatForm.markAllAsTouched();
    }
  }
}
