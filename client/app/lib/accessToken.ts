let accessToken: string | null = "";

function setAccessToken(token: string) {
  accessToken = token;
}

const getAccessToken = () => accessToken;

async function refreshAccessToken() {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  setAccessToken(data.accessToken);
  return data.accessToken as string;
}

export { setAccessToken, getAccessToken, refreshAccessToken };
