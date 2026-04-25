"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
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

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isLoading }}>
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
