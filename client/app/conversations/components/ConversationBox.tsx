import useOtherUser from "@/app/_hooks/useOtherUser";
import { ConversationType } from "@/app/_types/ConversationType";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface ConversationBoxProps {
  data: ConversationType;
  selected: boolean;
}

export default function ConversationBox({
  data,
  selected,
}: ConversationBoxProps) {
  const otherUser = useOtherUser(data);
  //   console.log(otherUser);
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data._id}`);
  }, [router, data]);

  const lastMessage = useMemo(() => {
    const message = data.lastMessage?.text || "";
    return message;
  }, [data]);
  console.log(otherUser);

  // const userEmail = useMemo(() => data.participants?[0] || "", [data]);

  //   const hasSeen = useMemo(() => {
  //     if (!lastMessage) return false;
  //     const seenArray = lastMessage.seen || [];
  //     if (!userEmail) {
  //       return false;
  //     }
  //     return seenArray.filter((user) => user.email === userEmail);
  //   }, [lastMessage]);

  return <div>Conversation Message</div>;
}
