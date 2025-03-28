import { Component, inject } from '@angular/core';

import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-auth-dialog',
  imports: [
    AsyncPipe,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatTabsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    CdkScrollable,
  ],
  templateUrl: './new-chat-dialog.component.html',
  styleUrl: './new-chat-dialog.component.scss',
})
export class NewChatDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly dialogRef = inject(MatDialogRef<NewChatDialogComponent>);

  participants$ = this.userService.getUsers();

  newChatForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    participants: ['', Validators.required],
  });

  onCreateChat() {
    if (this.newChatForm.valid) {
      console.log(this.newChatForm.value);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSelectionChange(event: MatSelectionListChange) {
    const selectedOptions = event.source.selectedOptions.selected.map(
      (o) => o.value as string,
    );

    this.newChatForm.patchValue({
      participants: selectedOptions,
    });
  }
}
