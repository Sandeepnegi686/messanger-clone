import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "./app/lib/accessToken";

export async function middleware(req: NextRequest, res: NextResponse) {
  // const accesToken = req.cookies.get("accessToken");
  // const token = getAccessToken;
  // if (!token) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*"],
};
