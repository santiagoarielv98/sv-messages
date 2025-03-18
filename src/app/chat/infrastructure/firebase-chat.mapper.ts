import { ChatEntity } from '../domain/chat.entity';

export class FirebaseChatMapper {
  static toEntity(data: Omit<ChatEntity, 'id'>, id: string): ChatEntity {
    return {
      ...data,
      id,
    };
  }

  static toFirestore(data: ChatEntity): Omit<ChatEntity, 'id'> {
    return {
      messages: data.messages ? data.messages : [],
      lastMessage: null,
      participants: data.participants ? data.participants : [],
    };
  }
}
