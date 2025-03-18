import { MessageEntity } from './message.entity';

export interface ChatEntity {
  id: string;
  messages: MessageEntity[];
  participants: string[];
  lastMessage: MessageEntity | null;
}
