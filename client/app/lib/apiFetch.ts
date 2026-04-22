import { setAccessToken } from "./accessToken";

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
    credentials: "include", // IMPORTANT for cookies
  });

  if (res.status === 401) {
    // try refreshing token
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setAccessToken(data.accessToken);

      // retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
        credentials: "include",
      });
    } else {
      // logout user
      setAccessToken("");
      window.location.href = "/login";
    }
  }

  return res;
};
