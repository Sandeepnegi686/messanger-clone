import BASE_API_URL from "@/app/lib/api";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      { success: false, message: "Access Token is not provided in Header" },
      { status: 401 },
    );
  }
  const body = await req.json();
  const response = await fetch(
    `${BASE_API_URL}/api/v1/conversation/createConversation`,
    {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      cache: "no-store",
    },
  );
  const data = await response.json();

  if (!response.ok) {
    return Response.json(data, {
      status: response.status,
    });
  }

  return Response.json(data, {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      { success: false, message: "Access Token is not provided in Header" },
      { status: 401 },
    );
  }

  const response = await fetch(
    `${BASE_API_URL}/api/v1/conversation/getConversations`,
    {
      cache: "no-store",
      headers: {
        Authorization: authHeader,
      },
    },
  );

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
