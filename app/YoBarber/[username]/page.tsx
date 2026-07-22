"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.yobarber.app";

export default function BarberDeepLinkPage() {
  const params = useParams();
  const username = params?.username as string;
  const [status, setStatus] = useState("Opening YoBarber app...");

  useEffect(() => {
    if (!username) return;

    const appSchemeUrl = `yobarber://barber?barber=${encodeURIComponent(username)}`;
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);

    if (isMobile) {
      // Attempt to open native app
      window.location.href = appSchemeUrl;

      // Fallback timer if app isn't installed
      const timer = setTimeout(() => {
        setStatus("YoBarber app not detected. Redirecting to Google Play...");
        window.location.href = PLAY_STORE_URL;
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      setStatus("Mobile app link detected. Opening Play Store...");
      const timer = setTimeout(() => {
        window.location.href = PLAY_STORE_URL;
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [username]);

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#0a0a0f",
        color: "#f0f0f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "#12121a",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          maxWidth: "420px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Image
          src="/yobarber/logo.png"
          alt="YoBarber"
          width={64}
          height={64}
          style={{ borderRadius: "16px" }}
        />
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>
          YoBarber
        </h1>
        {username && (
          <p
            style={{
              fontSize: "0.9rem",
              color: "#3b82f6",
              fontWeight: 600,
              margin: 0,
              background: "rgba(59, 130, 246, 0.1)",
              padding: "6px 16px",
              borderRadius: "100px",
            }}
          >
            @{username}
          </p>
        )}
        <p style={{ fontSize: "0.95rem", color: "#a0a0b8", margin: 0 }}>
          {status}
        </p>
        <a
          href={PLAY_STORE_URL}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            textDecoration: "none",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: 600,
            marginTop: "10px",
          }}
        >
          Download YoBarber
        </a>
      </div>
    </div>
  );
}
