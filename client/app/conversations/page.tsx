"use client";
import React from "react";
import useConversation from "../_hooks/useConversation";
import EmptyState from "../_components/EmptyState";
import clsx from "clsx";

export default function Page() {
  const { conversationId, isOpen } = useConversation();
  return (
    <div
      className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
}
