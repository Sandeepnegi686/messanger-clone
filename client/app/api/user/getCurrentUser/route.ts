import BASE_API_URL from "@/app/lib/api";
import { cookies } from "next/headers";
// import { apiFetch } from "@/app/lib/apiFetch";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken");
  const response = await fetch(`${BASE_API_URL}/api/v1/auth/me`, {
    cache: "no-store",
    headers: {
      Cookie: `accessToken=${token}`,
    },
  });
  if (!response.ok) {
    return Response.json(null, { status: response.status });
  }
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
