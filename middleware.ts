// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { pass } from "./lib/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // admin pages
  if (pathname.includes("/edit/post")) {
    const cookie = request.cookies.get("pass")?.value;
    if (cookie !== pass) {
      //redirect to auth page
      return NextResponse.rewrite(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}
