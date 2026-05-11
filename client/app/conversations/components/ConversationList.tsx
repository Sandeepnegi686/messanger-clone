"use client";

import { GetConversations } from "@/app/_actions/getConversations";

export default function ConversationList() {
  const { conversations } = GetConversations();
  console.log(conversations);
  return <div></div>;
}
