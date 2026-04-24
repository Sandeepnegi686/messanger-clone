import fetcher from "../lib/fetcher";
import useSWR from "swr";
import { getAccessToken } from "../lib/accessToken";

export function GetCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR(
    ["/api/user/getCurrentUser", getAccessToken()],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  console.log(data);
  return {
    currentUser: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
