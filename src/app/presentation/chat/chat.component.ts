import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../application/services/message.service';
import { Message } from '../../domain/entities/message';
import { MessageListComponent } from "../components/message-list/message-list.component";
import { MessageInputComponent } from "../components/message-input/message-input.component";

@Component({
  selector: 'app-chat',
  imports: [MessageListComponent, MessageInputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  async ngOnInit() {
    this.messages = await this.messageService.getMessages();
  }

  async sendMessage(content: string) {
    await this.messageService.sendMessage(content, 'user1');
    this.messages = await this.messageService.getMessages();
  }
}
