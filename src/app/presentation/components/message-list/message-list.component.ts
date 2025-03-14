import { Component, Input } from '@angular/core';
import { Message } from '../../../domain/entities/message';

@Component({
  selector: 'app-message-list',
  imports: [],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent {
  @Input() messages: Message[] = [];
}
