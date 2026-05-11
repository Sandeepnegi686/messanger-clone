import React, { useCallback, useState } from "react";
import { UserType } from "../_types/UserType";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";
import Avatar from "./Avatar";
import toast from "react-hot-toast";
interface UserBoxProps {
  user: UserType;
}

export default function UserBox({ user }: UserBoxProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { apiFetch, accessToken } = useAuth();

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch("/api/conversations", {
        method: "POST",
        body: JSON.stringify({ participants: [user._id] }),
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/conversations/${user._id}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, apiFetch, router, user._id]);

  return (
    <div
      className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
      onClick={handleClick}
    >
      <Avatar user={user} />

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
