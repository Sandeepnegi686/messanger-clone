import { useMemo } from "react";
import { ConversationType } from "../_types/ConversationType";
import { GetCurrentUser } from "../_actions/getCurrentUser";

const useOtherUser = (conversations: ConversationType) => {
  const { currentUser } = GetCurrentUser();
  const otherUsers = useMemo(() => {
    const users =
      conversations.participants?.filter(
        (user) => user.email !== currentUser.email,
      ) || [];
    return users;
  }, [conversations, currentUser]);
  return otherUsers;
};

export default useOtherUser;
