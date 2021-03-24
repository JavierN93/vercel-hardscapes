import { MessageFrom } from '../enums';

export interface PendingMessage {
  from: MessageFrom,
  message: string;
  createdAt: string;
  email: string;
  project: string;
  chatId?: string;
  recipientName: string;
  senderName: string;
  messageIds: string[];
}
