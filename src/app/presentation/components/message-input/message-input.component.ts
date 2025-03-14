import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  imports: [FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  messageContent = '';

  onSend() {
    if (this.messageContent.trim()) {
      this.sendMessage.emit(this.messageContent);
      this.messageContent = '';
    }
  }
}
