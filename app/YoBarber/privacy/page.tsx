import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy | YoBarber",
  description:
    "Privacy Policy for YoBarber application. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>

      <header className="privacy-header">
        <div className="header-inner">
          <div className="header-brand">
            <Image
              src="/yobarber/logo.png"
              alt="YoBarber Logo"
              width={28}
              height={28}
              style={{ borderRadius: "6px" }}
            />
            <span>YoBarber</span>
            <div className="dot"></div>
            <span
              style={{
                color: "var(--text-muted)",
                fontWeight: 400,
                fontSize: "13px",
              }}
            >
              Privacy Policy
            </span>
          </div>
          <Link href="/YoBarber" className="header-back">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to YoBarber
          </Link>
        </div>
      </header>

      <main className="privacy-wrapper">
        <div className="privacy-hero">
          <div className="badge">Legal Document</div>
          <h1>Privacy Policy</h1>
          <p className="subtitle">
            How YoBarber collects, uses, and protects your personal data when you
            use our mobile application and services.
          </p>
          <p className="effective-date">Last updated: July 22, 2026</p>
        </div>

        <section className="policy-section">
          <span className="section-number">SECTION 01</span>
          <h2>Introduction</h2>
          <p>
            Welcome to <strong>YoBarber</strong>. We respect your privacy and
            are committed to protecting your personal data. This privacy policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our mobile application and related
            services.
          </p>
          <div className="highlight-card">
            <p>
              By downloading, accessing, or using YoBarber, you agree to the
              collection and use of information in accordance with this policy.
              If you do not agree, please do not use the application.
            </p>
          </div>
        </section>

        <section className="policy-section">
          <span className="section-number">SECTION 02</span>
          <h2>Information We Collect</h2>
          <p>
            We collect several types of information to provide and improve our
            queue management and booking services:
          </p>
          <ul>
            <li>
              <strong>Account & Profile Data:</strong> Full name, phone number,
              email address, profile photo, and role (Client or Barber).
            </li>
            <li>
              <strong>Queue & Booking Data:</strong> Information about your
              barbershop reservations, queue positions, visit history, and
              preferred services.
            </li>
            <li>
              <strong>Device & Technical Data:</strong> Device model, operating
              system version, unique device identifiers, IP address, and push
              notification tokens.
            </li>
            <li>
              <strong>Location Data:</strong> Coarse or precise location (with
              your permission) to help you find nearby barbershops.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <span className="section-number">SECTION 03</span>
          <h2>How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>
              To manage live barber queues and send real-time status updates.
            </li>
            <li>
              To facilitate appointment bookings between clients and barbers.
            </li>
            <li>
              To send push notifications regarding your queue position,
              reminders, and confirmations.
            </li>
            <li>
              To improve app performance, troubleshoot issues, and enhance user
              experience.
            </li>
            <li>
              To ensure platform security and prevent fraudulent activity.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <span className="section-number">SECTION 04</span>
          <h2>Data Sharing and Disclosure</h2>
          <p>
            We value your trust. We do not sell your personal data to third
            parties. We share information only in limited circumstances:
          </p>
          <ul>
            <li>
              <strong>With Barbers / Clients:</strong> Basic details (name, booking
              time, service requested) are shared between clients and barbers to
              fulfill services.
            </li>
            <li>
              <strong>Service Providers:</strong> Cloud hosting, database, and
              push notification services (e.g., Supabase, Firebase) that process
              data strictly on our behalf.
            </li>
            <li>
              <strong>Legal Compliance:</strong> When required by law or in
              response to valid requests by public authorities.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <span className="section-number">SECTION 05</span>
          <h2>Data Security & Retention</h2>
          <p>
            We implement robust technical and organizational measures to protect
            your data against unauthorized access, loss, or alteration. Your data
            is encrypted in transit and at rest.
          </p>
          <p>
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this policy or to comply with legal
            obligations. You may request account deletion at any time.
          </p>
        </section>

        <section className="policy-section">
          <span className="section-number">SECTION 06</span>
          <h2>Your Privacy Rights</h2>
          <p>Depending on your location, you have the right to:</p>
          <ul>
            <li>Access, update, or delete your personal data.</li>
            <li>Opt out of non-essential communications or push notifications.</li>
            <li>Withdraw consent for location tracking at any time via device settings.</li>
            <li>Request a copy of the data we hold about you.</li>
          </ul>
        </section>

        <section className="policy-section">
          <span className="section-number">SECTION 07</span>
          <h2>Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy
            Policy, please contact us:
          </p>
          <div className="highlight-card">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:achrafahrach44@gmail.com">
                achrafahrach44@gmail.com
              </a>
              <br />
              <strong>Developer:</strong> Achraf Ahrach (
              <a
                href="https://ahrach.me"
                target="_blank"
                rel="noopener noreferrer"
              >
                ahrach.me
              </a>
              )
            </p>
          </div>
        </section>

        <footer className="privacy-footer">
          <p>© 2026 YoBarber. All rights reserved.</p>
          <div className="footer-links">
            <Link href="/YoBarber">YoBarber Home</Link>
            <a href="https://ahrach.me">Developer Portfolio</a>
            <a href="mailto:achrafahrach44@gmail.com">Contact</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
