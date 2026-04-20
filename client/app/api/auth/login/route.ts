import BASE_API_URL from "@/app/lib/api";

export async function POST(req: Request) {
  const body = await req.json();
  const response = await fetch(`${BASE_API_URL}/api/v1/auth/login`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const cookies = response.headers.get("set-cookie");
  return Response.json(data, {
    status: response.status,
    headers: {
      "Set-cookie": cookies || "",
      "Content-Type": "application/json",
    },
  });
}
