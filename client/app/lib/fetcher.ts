const fetcher = async ([url, token]: [string, string | null]) => {
  if (!token) return null;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
};

export default fetcher;
