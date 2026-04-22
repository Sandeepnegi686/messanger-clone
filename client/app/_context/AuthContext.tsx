"use client";

import { useEffect } from "react";
import { setAccessToken } from "../lib/accessToken";

interface Props {
  accessToken: string;
}

export default function AuthHydrator({ accessToken }: Props) {
  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken]);

  return null;
}
