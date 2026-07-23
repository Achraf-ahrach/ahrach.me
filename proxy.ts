import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Ignore static assets, images, and internal Next.js requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(png|jpe?g|svg|webp|gif|ico|css|js)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 1. Normalize lowercase /yobarber... page routes to /YoBarber... for Linux (Vercel) case-sensitivity
  if (pathname.startsWith("/yobarber")) {
    const correctedPath = "/YoBarber" + pathname.slice(9);
    const queryString = searchParams.toString();
    const targetUrl = new URL(
      correctedPath + (queryString ? `?${queryString}` : ""),
      request.url
    );
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
