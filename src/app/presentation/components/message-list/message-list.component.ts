import { Component, Input } from '@angular/core';
import { GetCurrentUserUseCase } from '../../../application/use-cases/auth.use-case';
import { Message } from '../../../domain/entities/message';
import { MessageItemComponent } from '../message-item/message-item.component';
import { Observable } from 'rxjs';
import { User } from '../../../domain/entities/user';
import { AsyncPipe } from '@angular/common';

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
