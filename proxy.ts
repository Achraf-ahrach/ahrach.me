import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle /YoBarber?barber=<username> legacy QR links
  if (pathname.toLowerCase() === "/yobarber") {
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
  matcher: ["/YoBarber"],
};
