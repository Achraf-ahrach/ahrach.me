import type { Metadata } from "next";
import PrivacyPolicyContent from "@/components/yobarber/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | YoBarber",
  description:
    "Privacy Policy for YoBarber application. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
