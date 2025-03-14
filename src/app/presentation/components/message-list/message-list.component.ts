import { Component, Input } from '@angular/core';
import { Message } from '../../../domain/entities/message';
import { MessageItemComponent } from "../message-item/message-item.component";

@Component({
  selector: 'app-message-list',
  imports: [MessageItemComponent],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent {
  @Input() messages: Message[] = [];
}
