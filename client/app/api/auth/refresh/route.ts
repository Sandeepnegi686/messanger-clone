import BASE_API_URL from "@/app/lib/api";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("refreshToken")?.value;

  if (!token) {
    return Response.json(null, {
      status: 401,
    });
  }
  const response = await fetch(`${BASE_API_URL}/api/v1/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refreshToken=${token}`,
    },
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok) {
    return Response.json(data, {
      status: response.status,
    });
  }
  const cookie = response.headers.get("set-cookie");

  return Response.json(data, {
    status: response.status,
    headers: {
      "Set-Cookie": cookie || "",
      "Content-Type": "application/json",
    },
  });
}
