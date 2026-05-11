export interface ConversationType {
  _id?: string;
  name: string;
  isGroup: boolean;
  participants?: string[];
  admins?: string[];
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
}
