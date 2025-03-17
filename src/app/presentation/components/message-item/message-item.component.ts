import { Component, Input } from '@angular/core';
import { Message } from '../../../domain/entities/message';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-message-item',
  imports: [MatCardModule],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss',
})
export class MessageItemComponent {
  @Input() message!: Message;
  @Input() isOwn = false;
}
