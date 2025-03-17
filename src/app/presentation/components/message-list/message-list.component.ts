import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { GetCurrentUserUseCase } from '../../../application/use-cases/auth.use-case';
import { Message } from '../../../domain/entities/message';
import { User } from '../../../domain/entities/user';
import { MessageItemComponent } from '../message-item/message-item.component';

@Component({
  selector: 'app-message-list',
  imports: [MessageItemComponent, AsyncPipe],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss',
})
export class MessageListComponent {
  @Input() messages: Message[] | null = [];

  currentUser$: Observable<User | null>;

  constructor(private getCurrentUserUseCase: GetCurrentUserUseCase) {
    this.currentUser$ = this.getCurrentUserUseCase.execute();
  }
}
