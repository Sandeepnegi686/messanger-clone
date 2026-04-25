import fetcher from "../lib/fetcher";
import useSWR from "swr";
import { getAccessToken } from "../lib/accessToken";
// import { useAuth } from "@/app/_context/AuthContext"

export function GetCurrentUser() {
  // const {accessToken} = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    ["/api/user/getCurrentUser", getAccessToken()],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  // console.log(data);
  return {
    currentUser: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
