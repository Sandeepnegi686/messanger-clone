"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./inputs/Input";
import Button from "./Button";
import AuthSocialButton from "./AuthSocialButton";
import { BsGoogle } from "react-icons/bs";
import BASE_API_URL from "../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserType } from "../_types/UserType";
import { setAccessToken } from "../lib/accessToken";

type Varient = "LOGIN" | "REGISTER";

export default function AuthForm() {
  const router = useRouter();
  // useEffect(() => {
  //   if (currentUser) {
  //     router.push("/users");
  //   }
  // }, [currentUser, router]);
  const [varient, setVarient] = useState<Varient>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVarient = useCallback(() => {
    if (varient === "LOGIN") {
      setVarient("REGISTER");
    } else {
      setVarient("LOGIN");
    }
  }, [varient]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      if (varient === "REGISTER") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(data),
        });
        const fetchedData = await res.json();
        if (fetchedData.success) {
          toast.success(fetchedData.message);
          router.push("/users");
          setAccessToken(fetchedData.accessToken);
        } else {
          toast.error(fetchedData.message);
        }
      }
      if (varient === "LOGIN") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        const fetchedData = await res.json();
        if (fetchedData.success) {
          toast.success(fetchedData.message);
          router.push("/users");
          setAccessToken(fetchedData.accessToken);
        } else {
          toast.error(fetchedData.message);
        }
      }
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  async function googleLogin() {
    window.location.href = `${BASE_API_URL}/api/v1/auth/google`;
  }

  useEffect(() => {}, []);

  return (
    <div className="mt-8 mx-auto w-[90%] md:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {varient === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              type="text"
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email address"
            register={register}
            type="email"
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            register={register}
            type="password"
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {varient === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="inset-0 flex items-center justify-center">
              <div className="w-full border-t border-gray-300"></div>
              <div className="absolute flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <AuthSocialButton icon={BsGoogle} onClick={googleLogin} />
            </div>
          </div>

          <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
            <div>
              {varient === "LOGIN"
                ? "New to Messenger?"
                : "Already have an account?"}
            </div>
            <div onClick={toggleVarient} className="underline cursor-pointer">
              {varient === "LOGIN" ? "Create an account" : "Login"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
