import { MessageType } from "./MessageType";
import { UserType } from "./UserType";

export interface ConversationType {
  _id?: string;
  name: string;
  isGroup: boolean;
  participants?: UserType[];
  admins?: string[];
  lastMessage: string | MessageType;
  createdAt: Date;
  updatedAt: Date;
}
