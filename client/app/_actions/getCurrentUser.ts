import useSWR from "swr";
import { useAuth } from "../_context/AuthContext";
import fetcher from "../lib/fetcher";

export function GetCurrentUser() {
  const { accessToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    accessToken ? ["/api/user/getCurrentUser", accessToken] : null, // 🔥 important
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    currentUser: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
