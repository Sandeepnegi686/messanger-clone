import { ConversationType } from "./ConversationType";
import { UserType } from "./UserType";

export interface MessageType {
  sender: string | UserType;
  conversation: string | ConversationType;
  text: string;
  image: string;
  readBy: string[] | UserType[];
  deliveredTo: string[] | UserType[];
}
