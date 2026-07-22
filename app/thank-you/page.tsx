import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your message has been sent successfully.",
};

export default function ThankYouPage() {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#f5f7fa",
        color: "#333",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "20px",
            color: "#045177",
          }}
        >
          Thank You!
        </h1>
        <p style={{ fontSize: "1rem", marginBottom: "30px" }}>
          Your message has been sent successfully. I&apos;ll get back to you soon.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#045177",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            transition: "background 0.3s ease",
          }}
        >
          Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
