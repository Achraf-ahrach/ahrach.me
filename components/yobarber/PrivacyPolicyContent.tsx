"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { LangKey, LANG_LABELS } from "./translations";

const privacyTranslations = {
  en: {
    subtitle_nav: "Privacy Policy",
    badge: "Legal Document",
    title: "Privacy Policy",
    subtitle:
      "How YoBarber collects, uses, and protects your personal data when you use our mobile application and services.",
    effective_date: "Last updated: July 22, 2026",
    sec1_num: "SECTION 01",
    sec1_title: "Introduction",
    sec1_text:
      "Welcome to YoBarber. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services.",
    sec1_card:
      "By downloading, accessing, or using YoBarber, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use the application.",
    sec2_num: "SECTION 02",
    sec2_title: "Information We Collect",
    sec2_intro:
      "We collect several types of information to provide and improve our queue management and booking services:",
    sec2_item1_label: "Account & Profile Data:",
    sec2_item1_text:
      "Full name, phone number, email address, profile photo, and role (Client or Barber).",
    sec2_item2_label: "Queue & Booking Data:",
    sec2_item2_text:
      "Information about your barbershop reservations, queue positions, visit history, and preferred services.",
    sec2_item3_label: "Device & Technical Data:",
    sec2_item3_text:
      "Device model, operating system version, unique device identifiers, IP address, and push notification tokens.",
    sec2_item4_label: "Location Data:",
    sec2_item4_text:
      "Coarse or precise location (with your permission) to help you find nearby barbershops.",
    sec3_num: "SECTION 03",
    sec3_title: "How We Use Your Information",
    sec3_intro: "We use the collected information for the following purposes:",
    sec3_item1:
      "To manage live barber queues and send real-time status updates.",
    sec3_item2: "To facilitate appointment bookings between clients and barbers.",
    sec3_item3:
      "To send push notifications regarding your queue position, reminders, and confirmations.",
    sec3_item4:
      "To improve app performance, troubleshoot issues, and enhance user experience.",
    sec3_item5: "To ensure platform security and prevent fraudulent activity.",
    sec4_num: "SECTION 04",
    sec4_title: "Data Sharing and Disclosure",
    sec4_intro:
      "We value your trust. We do not sell your personal data to third parties. We share information only in limited circumstances:",
    sec4_item1_label: "With Barbers / Clients:",
    sec4_item1_text:
      "Basic details (name, booking time, service requested) are shared between clients and barbers to fulfill services.",
    sec4_item2_label: "Service Providers:",
    sec4_item2_text:
      "Cloud hosting, database, and push notification services (e.g., Supabase, Firebase) that process data strictly on our behalf.",
    sec4_item3_label: "Legal Compliance:",
    sec4_item3_text:
      "When required by law or in response to valid requests by public authorities.",
    sec5_num: "SECTION 05",
    sec5_title: "Data Security & Retention",
    sec5_p1:
      "We implement robust technical and organizational measures to protect your data against unauthorized access, loss, or alteration. Your data is encrypted in transit and at rest.",
    sec5_p2:
      "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy or to comply with legal obligations. You may request account deletion at any time.",
    sec6_num: "SECTION 06",
    sec6_title: "Your Privacy Rights",
    sec6_intro: "Depending on your location, you have the right to:",
    sec6_item1: "Access, update, or delete your personal data.",
    sec6_item2:
      "Opt out of non-essential communications or push notifications.",
    sec6_item3:
      "Withdraw consent for location tracking at any time via device settings.",
    sec6_item4: "Request a copy of the data we hold about you.",
    sec7_num: "SECTION 07",
    sec7_title: "Contact Us",
    sec7_p1:
      "If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:",
    email_label: "Email:",
    developer_label: "Developer:",
    copyright: "© 2026 YoBarber. All rights reserved.",
    footer_home: "YoBarber Home",
    footer_portfolio: "Developer Portfolio",
    footer_contact: "Contact",
    back_tooltip: "Back to YoBarber",
  },
  fr: {
    subtitle_nav: "Politique de Confidentialité",
    badge: "Document Légal",
    title: "Politique de Confidentialité",
    subtitle:
      "Comment YoBarber collecte, utilise et protège vos données personnelles lors de l'utilisation de notre application mobile et de nos services.",
    effective_date: "Dernière mise à jour : 22 juillet 2026",
    sec1_num: "SECTION 01",
    sec1_title: "Introduction",
    sec1_text:
      "Bienvenue sur YoBarber. Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations.",
    sec1_card:
      "En téléchargeant, accédant ou utilisant YoBarber, vous acceptez la collecte et l'utilisation de vos informations conformément à cette politique. Si vous n'êtes pas d'accord, veuillez ne pas utiliser l'application.",
    sec2_num: "SECTION 02",
    sec2_title: "Données Collectées",
    sec2_intro:
      "Nous collectons plusieurs types d'informations afin de fournir et d'améliorer nos services de gestion de file d'attente et de réservation :",
    sec2_item1_label: "Données de compte & profil :",
    sec2_item1_text:
      "Nom complet, numéro de téléphone, adresse e-mail, photo de profil et rôle (Client ou Coiffeur).",
    sec2_item2_label: "Données de réservation & file d'attente :",
    sec2_item2_text:
      "Informations sur vos réservations de salon, vos positions dans la file d'attente, votre historique et vos services préférés.",
    sec2_item3_label: "Données techniques & d'appareil :",
    sec2_item3_text:
      "Modèle de l'appareil, version du système d'exploitation, identifiants uniques, adresse IP et jetons de notification push.",
    sec2_item4_label: "Données de géolocalisation :",
    sec2_item4_text:
      "Localisation approximative ou précise (avec votre autorisation) pour vous aider à trouver des salons de coiffure à proximité.",
    sec3_num: "SECTION 03",
    sec3_title: "Utilisation des Données",
    sec3_intro: "Nous utilisons les informations collectées aux fins suivantes :",
    sec3_item1:
      "Gérer la file d'attente des coiffeurs en direct et envoyer des mises à jour en temps réel.",
    sec3_item2: "Faciliter la réservation de rendez-vous entre clients et coiffeurs.",
    sec3_item3:
      "Envoyer des notifications push concernant votre position dans la file d'attente, rappels et confirmations.",
    sec3_item4:
      "Améliorer les performances de l'application et l'expérience utilisateur.",
    sec3_item5:
      "Assurer la sécurité de la plateforme et prévenir les activités frauduleuses.",
    sec4_num: "SECTION 04",
    sec4_title: "Partage et Divulgation des Données",
    sec4_intro:
      "Nous apprécions votre confiance. Nous ne vendons pas vos données personnelles à des tiers. Nous ne partageons des informations que dans des cas limités :",
    sec4_item1_label: "Avec les Coiffeurs / Clients :",
    sec4_item1_text:
      "Les détails de base (nom, heure de réservation, service demandé) sont partagés pour exécuter les services.",
    sec4_item2_label: "Prestataires de Services :",
    sec4_item2_text:
      "Hébergement cloud, base de données et services de notification (ex. Supabase, Firebase) qui traitent les données strictement pour notre compte.",
    sec4_item3_label: "Conformité Légale :",
    sec4_item3_text:
      "Lorsque la loi l'exige ou en réponse à des demandes valides des autorités publiques.",
    sec5_num: "SECTION 05",
    sec5_title: "Sécurité & Conservation des Données",
    sec5_p1:
      "Nous mettons en œuvre des mesures techniques et organisationnelles rigoureuses pour protéger vos données contre tout accès non autorisé, perte ou altération. Vos données sont chiffrées en transit et au repos.",
    sec5_p2:
      "Nous ne conservons vos informations personnelles que le temps nécessaire à la réalisation des finalités énoncées dans cette politique. Vous pouvez demander la suppression de votre compte à tout moment.",
    sec6_num: "SECTION 06",
    sec6_title: "Vos Droits de Confidentialité",
    sec6_intro: "Selon votre région, vous disposez des droits suivants :",
    sec6_item1:
      "Accéder à vos données personnelles, les mettre à jour ou les supprimer.",
    sec6_item2:
      "Vous désabonner des communications non essentielles ou des notifications push.",
    sec6_item3:
      "Retirer votre consentement pour la géolocalisation à tout moment via les paramètres de l'appareil.",
    sec6_item4: "Demander une copie des données que nous détenons à votre sujet.",
    sec7_num: "SECTION 07",
    sec7_title: "Contactez-nous",
    sec7_p1:
      "Si vous avez des questions, des préoccupations ou des demandes concernant cette politique de confidentialité, veuillez nous contacter :",
    email_label: "E-mail :",
    developer_label: "Développeur :",
    copyright: "© 2026 YoBarber. Tous droits réservés.",
    footer_home: "Accueil YoBarber",
    footer_portfolio: "Portfolio du Développeur",
    footer_contact: "Contact",
    back_tooltip: "Retour à YoBarber",
  },
  ar: {
    subtitle_nav: "سياسة الخصوصية",
    badge: "وثيقة قانونية",
    title: "سياسة الخصوصية",
    subtitle:
      "كيف يجمع YoBarber بياناتك الشخصية ويستخدمها ويحميها عند استخدام تطبيقنا وخدماتنا.",
    effective_date: "آخر تحديث: 22 يوليوز 2026",
    sec1_num: "القسم 01",
    sec1_title: "مقدمة",
    sec1_text:
      "مرحبًا بك في YoBarber. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. تشرح سياسة الخصوصية هذه كيفية جمع معلوماتك واستخدامها والإفصاح عنها وحمايتها عند استخدام تطبيقنا والخدمات ذات الصلة.",
    sec1_card:
      "من خلال تنزيل YoBarber أو الوصول إليه أو استخدامه، فإنك توافق على جمع المعلومات واستخدامها وفقًا لهذه السياسة. إذا كنت لا توافق، فيرجى عدم استخدام التطبيق.",
    sec2_num: "القسم 02",
    sec2_title: "المعلومات التي نجمعها",
    sec2_intro:
      "نجمع عدة أنواع من المعلومات لتقديم خدمات إدارة قائمة الانتظار والحجز وتحسينها:",
    sec2_item1_label: "بيانات الحساب والملف الشخصي:",
    sec2_item1_text:
      "الاسم الكامل، رقم الهاتف، البريد الإلكتروني، صورة الملف الشخصي، والدور (زبون أو حلاق).",
    sec2_item2_label: "بيانات الدور والحجز:",
    sec2_item2_text:
      "معلومات حول حجوزات صالون الحلاقة الخاص بك، ومواقف قائمة الانتظار، وسجل الزيارات، والخدمات المفضلة.",
    sec2_item3_label: "بيانات الجهاز والبيانات الفنية:",
    sec2_item3_text:
      "طراز الجهاز، إصدار نظام التشغيل، المعرفات الفريدة للجهاز، عنوان IP، ورموز إشعارات الدفع.",
    sec2_item4_label: "بيانات الموقع الجغرافي:",
    sec2_item4_text:
      "الموقع التقريبي أو الدقيق (بإذن منك) لمساعدتك في العثور على صالونات الحلاقة المجاورة.",
    sec3_num: "القسم 03",
    sec3_title: "كيف نستخدم معلوماتك",
    sec3_intro: "نستخدم المعلومات المجمعة للأغراض التالية:",
    sec3_item1:
      "إدارة قوائم انتظار الحلاقين المباشرة وإرسال تحديثات الحالة في الوقت الفعلي.",
    sec3_item2: "تسهيل حجوزات المواعيد بين الزبائن والحلاقين.",
    sec3_item3:
      "إرسال إشعارات تهم موقعك في قائمة الانتظار والتذكيرات والتأكيدات.",
    sec3_item4:
      "تحسين أداء التطبيق وحل المشكلات الفنية وتطوير تجربة المستخدم.",
    sec3_item5: "ضمان أمان المنصة ومنع أي أنشطة احتيالية.",
    sec4_num: "القسم 04",
    sec4_title: "مشاركة البيانات والإفصاح عنها",
    sec4_intro:
      "نحن نقدر ثقتك. نحن لا نبيع بياناتك الشخصية لأطراف ثالثة. نتيح المعلومات فقط في حدود ضيقة:",
    sec4_item1_label: "مع الحلاقين / الزبائن:",
    sec4_item1_text:
      "يتم مشاركة التفاصيل الأساسية (الاسم، وقت الحجز، الخدمة المطلوبة) لتقديم الخدمات المطلوبة.",
    sec4_item2_label: "مزودو الخدمات:",
    sec4_item2_text:
      "خدمات الاستضافة السحابية وتخزين البيانات والإشعارات (مثل Supabase، Firebase) التي تعالج البيانات فقط نيابة عنا.",
    sec4_item3_label: "الامتثال القانوني:",
    sec4_item3_text:
      "عندما يتطلب القانون ذلك أو استجابة لطلبات صالحة من السلطات العامة.",
    sec5_num: "القسم 05",
    sec5_title: "أمان البيانات والاحتفاظ بها",
    sec5_p1:
      "نطبق تدابير فنية وتنظيمية قوية لحماية بياناتك من الوصول غير المصرح به أو الفقدان أو التغيير. يتم تشفير بياناتك أثناء النقل وأثناء التخزين.",
    sec5_p2:
      "نحتفظ بمعلوماتك الشخصية فقط للفترة اللازمة لتحقيق الأغراض المحددة في هذه السياسة. يمكنك طلب حذف حسابك في أي وقت.",
    sec6_num: "القسم 06",
    sec6_title: "حقوق الخصوصية الخاصة بك",
    sec6_intro: "بناءً على موقعك، لديك الحقوق التالية:",
    sec6_item1: "الوصول إلى بياناتك الشخصية أو تحديثها أو حذفها.",
    sec6_item2:
      "إلغاء الاشتراك في الاتصالات غير الضرورية أو إشعارات الدفع.",
    sec6_item3:
      "سحب موافقتك على تتبع الموقع في أي وقت عبر إعدادات الجهاز.",
    sec6_item4: "طلب نسخة من البيانات التي نحتفظ بها عنك.",
    sec7_num: "القسم 07",
    sec7_title: "تواصل معنا",
    sec7_p1:
      "إذا كانت لديك أي أسئلة أو مخاوف أو طلبات بشأن سياسة الخصوصية هذه، فيرجى التواصل معنا:",
    email_label: "البريد الإلكتروني:",
    developer_label: "المطور:",
    copyright: "© 2026 YoBarber. جميع الحقوق محفوظة.",
    footer_home: "الرئيسية YoBarber",
    footer_portfolio: "معرض المطور",
    footer_contact: "تواصل معنا",
    back_tooltip: "الرجوع إلى YoBarber",
  },
};

export default function PrivacyPolicyContent() {
  const [lang, setLang] = useState<LangKey>("en");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("yobarber_lang") as LangKey;
    if (saved && (saved === "en" || saved === "fr" || saved === "ar")) {
      setLang(saved);
    }
  }, []);

  const changeLang = (l: LangKey) => {
    setLang(l);
    setLangOpen(false);
    localStorage.setItem("yobarber_lang", l);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const t = privacyTranslations[lang];

  return (
    <div className="privacy-page" dir={lang === "ar" ? "rtl" : "ltr"}>
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
            <span className="brand-title">YoBarber</span>
            <div className="dot"></div>
            <span className="header-subtitle">{t.subtitle_nav}</span>
          </div>

          <div className="header-actions">
            {/* Language Selector Dropdown */}
            <div className="lang-switcher" ref={langRef} style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="privacy-lang-btn"
                type="button"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>{lang.toUpperCase()}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{
                    transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {langOpen && (
                <div className="privacy-lang-dropdown">
                  {(Object.keys(LANG_LABELS) as LangKey[]).map((l) => (
                    <button
                      key={l}
                      className={lang === l ? "active" : ""}
                      onClick={() => changeLang(l)}
                      type="button"
                    >
                      {l === "en"
                        ? "🇬🇧 English"
                        : l === "fr"
                        ? "🇫🇷 Français"
                        : "🇲🇦 العربية"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Back Arrow Button */}
            <Link
              href="/YoBarber"
              className="header-back-btn"
              title={t.back_tooltip}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="privacy-wrapper">
        <div className="privacy-hero">
          <div className="badge">{t.badge}</div>
          <h1>{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
          <p className="effective-date">{t.effective_date}</p>
        </div>

        <section className="policy-section">
          <span className="section-number">{t.sec1_num}</span>
          <h2>{t.sec1_title}</h2>
          <p>{t.sec1_text}</p>
          <div className="highlight-card">
            <p>{t.sec1_card}</p>
          </div>
        </section>

        <section className="policy-section">
          <span className="section-number">{t.sec2_num}</span>
          <h2>{t.sec2_title}</h2>
          <p>{t.sec2_intro}</p>
          <ul>
            <li>
              <strong>{t.sec2_item1_label}</strong> {t.sec2_item1_text}
            </li>
            <li>
              <strong>{t.sec2_item2_label}</strong> {t.sec2_item2_text}
            </li>
            <li>
              <strong>{t.sec2_item3_label}</strong> {t.sec2_item3_text}
            </li>
            <li>
              <strong>{t.sec2_item4_label}</strong> {t.sec2_item4_text}
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <span className="section-number">{t.sec3_num}</span>
          <h2>{t.sec3_title}</h2>
          <p>{t.sec3_intro}</p>
          <ul>
            <li>{t.sec3_item1}</li>
            <li>{t.sec3_item2}</li>
            <li>{t.sec3_item3}</li>
            <li>{t.sec3_item4}</li>
            <li>{t.sec3_item5}</li>
          </ul>
        </section>

        <section className="policy-section">
          <span className="section-number">{t.sec4_num}</span>
          <h2>{t.sec4_title}</h2>
          <p>{t.sec4_intro}</p>
          <ul>
            <li>
              <strong>{t.sec4_item1_label}</strong> {t.sec4_item1_text}
            </li>
            <li>
              <strong>{t.sec4_item2_label}</strong> {t.sec4_item2_text}
            </li>
            <li>
              <strong>{t.sec4_item3_label}</strong> {t.sec4_item3_text}
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <span className="section-number">{t.sec5_num}</span>
          <h2>{t.sec5_title}</h2>
          <p>{t.sec5_p1}</p>
          <p>{t.sec5_p2}</p>
        </section>

        <section className="policy-section">
          <span className="section-number">{t.sec6_num}</span>
          <h2>{t.sec6_title}</h2>
          <p>{t.sec6_intro}</p>
          <ul>
            <li>{t.sec6_item1}</li>
            <li>{t.sec6_item2}</li>
            <li>{t.sec6_item3}</li>
            <li>{t.sec6_item4}</li>
          </ul>
        </section>

        <section className="policy-section">
          <span className="section-number">{t.sec7_num}</span>
          <h2>{t.sec7_title}</h2>
          <p>{t.sec7_p1}</p>
          <div className="highlight-card">
            <p>
              <strong>{t.email_label}</strong>{" "}
              <a href="mailto:achrafahrach44@gmail.com">
                achrafahrach44@gmail.com
              </a>
              <br />
              <strong>{t.developer_label}</strong> Achraf Ahrach (
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
          <p>{t.copyright}</p>
          <div className="footer-links">
            <Link href="/YoBarber">{t.footer_home}</Link>
            <a href="https://ahrach.me">{t.footer_portfolio}</a>
            <a href="mailto:achrafahrach44@gmail.com">{t.footer_contact}</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
