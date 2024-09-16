import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {};

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
