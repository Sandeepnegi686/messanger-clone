import React from "react";
import { UserType } from "../_types/UserType";
import Image from "next/image";

interface AvatarProps {
  user: UserType;
}

export default function Avatar({ user }: AvatarProps) {
  return (
    <div className="relative">
      <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
        {user?.image && (
          <Image
            src={user?.image as string}
            alt="Avatar"
            width={100}
            height={100}
          />
        )}
      </div>
      <span
        className="absolute block rounded-full bg-green-500 ring-1 top-0 right-0 h-2 w-2 md:h-3
      md:w-3"
      ></span>
    </div>
  );
}
