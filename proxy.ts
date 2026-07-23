import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Normalize lowercase /yobarber... to /YoBarber... for Linux (Vercel) case-sensitivity
  if (pathname.startsWith("/yobarber")) {
    const correctedPath = "/YoBarber" + pathname.slice(9);
    const targetUrl = new URL(correctedPath + searchParams.toString() ? `?${searchParams.toString()}` : "", request.url);
    return NextResponse.redirect(targetUrl);
  }

  // 2. Handle /YoBarber?barber=<username> legacy QR links
  if (pathname === "/YoBarber") {
    const barber = searchParams.get("barber");
    if (barber) {
      return NextResponse.redirect(
        new URL(`/YoBarber/${encodeURIComponent(barber)}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/YoBarber/:path*", "/yobarber/:path*", "/YoBarber", "/yobarber"],
};
