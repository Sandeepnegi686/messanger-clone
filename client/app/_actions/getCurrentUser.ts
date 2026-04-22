import { cookies } from "next/headers";
import { UserType } from "../_types/UserType";

async function getCurrentUser(): Promise<UserType | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;
  let currentUser = null;

  if (token) {
    const res = await fetch("/api/user/getCurrentUser", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    currentUser = data.user;
  }
  return currentUser;
}

export default getCurrentUser;
