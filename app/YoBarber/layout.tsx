import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YoBarber — Barber Queue Management & Barbershop Booking App | Skip the Line",
  description:
    "YoBarber (Yo Barber) is the #1 barber queue management and barbershop booking app. Track your live queue position, book appointments instantly, and skip the line. Available on iOS & Android.",
  openGraph: {
    title: "YoBarber — Skip the Line, Not the Style",
    description:
      "Book your barber instantly, track your queue position in real time, and walk in exactly when it's your turn.",
    url: "https://ahrach.me/YoBarber",
    siteName: "YoBarber",
    images: [
      {
        url: "https://ahrach.me/yobarber/og-preview.png",
        width: 1200,
        height: 630,
        alt: "YoBarber App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YoBarber — Skip the Line, Not the Style",
    description:
      "Book your barber instantly, track your queue position in real time, and walk in exactly when it's your turn.",
    images: ["https://ahrach.me/yobarber/og-preview.png"],
  },
};

export default function YoBarberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
