import useSWR from "swr";
import { useAuth } from "../_context/AuthContext";
import fetcher from "../lib/fetcher";
import { ConversationType } from "../_types/ConversationType";

export function GetConversations() {
  const { accessToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    accessToken ? ["/api/conversations", accessToken] : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    conversations: (data?.conversations as ConversationType[]) ?? [],
    isLoading,
    error,
    mutate,
  };
}
