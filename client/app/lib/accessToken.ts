let accessToken: string | null = "";

function setAccessToken(token: string) {
  accessToken = token;
}

const getAccessToken = () => accessToken;

const initAuth = async () => {
  try {
    const res = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.success) {
      setAccessToken(data.accessToken);
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export { setAccessToken, getAccessToken, initAuth };
