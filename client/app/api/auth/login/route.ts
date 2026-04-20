import BASE_API_URL from "@/app/lib/api";

export async function POST(req: Request) {
  const body = await req.json();
  const response = await fetch(`${BASE_API_URL}/api/v1/auth/login`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const data = await response.json();
  const cookie = response.headers.get("set-cookie");

  if (!response.ok) {
    return Response.json(data, {
      status: response.status,
    });
  }

  return Response.json(data, {
    status: response.status,
    headers: {
      "Set-Cookie": cookie || "",
      "Content-Type": "application/json",
    },
  });
}
