import { Observable } from 'rxjs';
import { ChatEntity } from './chat.entity';
import { MessageEntity } from './message.entity';

export abstract class ChatRepository {
  abstract createChat(participants: string[]): Observable<ChatEntity>;
  abstract getChatsByUser(userId: string): Observable<ChatEntity[]>;
  abstract getChatById(chatId: string): Observable<ChatEntity | null>;
  abstract getLastMessages(chatId: string): Observable<MessageEntity[]>;
  abstract sendMessage(
    chatId: string,
    message: MessageEntity,
  ): Observable<MessageEntity>;
  abstract updateLastMessage(
    chatId: string,
    message: MessageEntity,
  ): Observable<void>;
}
