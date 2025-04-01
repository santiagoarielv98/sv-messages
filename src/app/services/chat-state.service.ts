import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat, ChatService, Message } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatStateService {
  private selectedChatSubject = new BehaviorSubject<Chat | null>(null);
  private chatNameSubject = new BehaviorSubject<string>('');
  private selectedMembersSubject = new BehaviorSubject<string[]>([]);
  private messageBodySubject = new BehaviorSubject<string>('');

  readonly selectedChat$ = this.selectedChatSubject.asObservable();
  readonly chatName$ = this.chatNameSubject.asObservable();
  readonly selectedMembers$ = this.selectedMembersSubject.asObservable();
  readonly messageBody$ = this.messageBodySubject.asObservable();

  constructor(private chatService: ChatService) {}

  selectChat(chat: Chat | null): void {
    this.selectedChatSubject.next(chat);
  }

  clearSelection(): void {
    this.selectedChatSubject.next(null);
  }

  setChatName(name: string): void {
    this.chatNameSubject.next(name);
  }

  setSelectedMembers(members: string[]): void {
    this.selectedMembersSubject.next(members);
  }

  setMessageBody(message: string): void {
    this.messageBodySubject.next(message);
  }

  resetChatForm(): void {
    this.chatNameSubject.next('');
    this.selectedMembersSubject.next([]);
  }

  getSelectedMessages(): Observable<Message[]> {
    return this.chatService.getMessagesForSelectedChat(this.selectedChat$);
  }
}
