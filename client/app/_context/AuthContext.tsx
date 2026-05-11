"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoading: boolean;
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
        } else {
          router.push("/");
          setAccessToken(null);
        }
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [router]);

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          authorization: `Bearer ${accessToken}`,
        },
        credentials: "include", // IMPORTANT for cookies
      });

      if (res.status === 401) {
        console.log("code run ");
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
          window.location.href = "/";
        }
      }

      return res;
    },
    [accessToken],
  );

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, isLoading, apiFetch }}
    >
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-400" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
