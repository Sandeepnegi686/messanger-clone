"use client";

import useRoutes from "@/app/_hooks/useRoutes";
import { useEffect, useState } from "react";
import DesktopItem from "./DesktopItem";
import { GetCurrentUser } from "@/app/_actions/getCurrentUser";
import { getAccessToken } from "@/app/lib/accessToken";
import {apiFetch} from "@/app/lib/apiFetch"
import { useAuth } from "@/app/_context/AuthContext"

export default function DesktopSidebar() {
  const routes = useRoutes();
  const {accessToken} = useAuth();
  
  useEffect(function () {
    async function getUser() {
      const res = await fetch("/api/user/getCurrentUser", {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });
      const data = await res.json();
      console.log(data);
    }
    getUser();
  }, []);

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r lg:border-r-gray-200 lg:pb-4 lg:flex lg:flex-col justify-between">
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((item) => (
            <DesktopItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={item.onClic}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}
