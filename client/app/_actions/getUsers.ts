import useSWR from "swr";
import { useAuth } from "../_context/AuthContext";
import fetcher from "../lib/fetcher";
import { UserType } from "../_types/UserType";

export function GetUsers() {
  const { accessToken } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    accessToken ? ["/api/user/getUsers", accessToken] : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    users: (data?.users as UserType[]) ?? [],
    isLoading,
    error,
    mutate,
  };
}
