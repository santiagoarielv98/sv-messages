export interface Chat {
  id?: string;
  name: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  createdAt: Date;
}
