import BASE_API_URL from "@/app/lib/api";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      { success: false, message: "Access Token is not provided in Header" },
      { status: 401 },
    );
  }

  const response = await fetch(`${BASE_API_URL}/api/v1/user/getUsers`, {
    cache: "no-store",
    headers: {
      Authorization: authHeader,
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
