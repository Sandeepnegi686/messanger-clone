"use client";
import Image from "next/image";
import AuthForm from "./_components/AuthForm";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccessToken, refreshAccessToken } from "./lib/accessToken";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();

      if (token) {
        router.replace("/users");
        return;
      }

      const newToken = await refreshAccessToken();

      if (newToken) {
        router.replace("/users");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height={40}
          width={40}
          className="mx-auto w-auto"
          src="/images/logo.png"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      {/* AUTH FORM */}
      <AuthForm />
    </div>
  );
}
