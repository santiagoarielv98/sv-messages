import { Observable } from 'rxjs';
import { ChatEntity } from './chat.entity';

export abstract class ChatRepository {
  abstract createChat(participants: string[]): Observable<ChatEntity>;
  abstract getChatsByUser(userId: string): Observable<ChatEntity[]>;
  // abstract createChat(chat: ChatEntity): Observable<ChatEntity>;

  // abstract findChatById(chatId:   string): Observable<ChatEntity | null>;
  // abstract addMessageToChat(
  //   chatId: string,
  //   message: MessageEntity,
  // ): Observable<void>;
  // abstract getChatsByUser(userId: string): Observable<ChatEntity[]>;
}
