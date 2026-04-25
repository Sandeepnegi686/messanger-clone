import BASE_API_URL from "@/app/lib/api";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  console.log(req.headers)
  const authHeader = req.headers.get("authorization");
  
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return Response.json({success: false,message: "Access Token is not provided in Header"}, {status: 401})
  }
  const cookieStore = cookies();
  
  const refreshToken = (await cookieStore).get("refreshToken");

  const response = await fetch(`${BASE_API_URL}/api/v1/auth/me`, {
    cache: "no-store",
    headers: {
      Authorization: authHeader,
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
