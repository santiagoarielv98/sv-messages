import { Component, Input } from '@angular/core';
import { Message } from '../../../domain/entities/message';

@Component({
  selector: 'app-message-item',
  imports: [],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  @Input() message!: Message;
}
