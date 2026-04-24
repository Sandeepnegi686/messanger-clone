import BASE_API_URL from "@/app/lib/api";
import { cookies } from "next/headers";
// import { apiFetch } from "@/app/lib/apiFetch";

export async function GET() {
  const cookieStore = cookies();
  let accessToken = (await cookieStore).get("accessToken");
  const refreshToken = (await cookieStore).get("refreshToken");
  const response = await fetch(`${BASE_API_URL}/api/v1/auth/me`, {
    cache: "no-store",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
  });
  if (response.status == 401) {
    const response = await fetch(`${BASE_API_URL}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok) {
      return Response.json(data, {
        status: response.status,
      });
    }
    accessToken = data.accessToken;
  }
  // return Response.json(null, { status: response.status });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
