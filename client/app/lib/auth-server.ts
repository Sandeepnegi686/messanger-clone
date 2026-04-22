import { cookies } from "next/headers";

export interface ServerAuthResult {
  accessToken: string;
  user: { id: string; email: string };
}

export async function getServerAuth(): Promise<ServerAuthResult | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) return null;

    const res = await fetch(`/api/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}
