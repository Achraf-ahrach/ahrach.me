export type LangKey = "en" | "fr" | "ar";

export interface TranslationSet {
  [key: string]: string;
}

export const translations: Record<LangKey, TranslationSet> = {
  en: {
    nav_features: "Features",
    nav_how: "How It Works",
    nav_download: "Download App",
    hero_badge: "Now Available",
    hero_title_1: "Skip the Line,",
    hero_title_2: "Not the Style.",
    hero_subtitle:
      "Book your barber instantly, track your queue position in real time, and walk in exactly when it's your turn. Your barbershop experience, reimagined.",
    cta_appstore: "App Store",
    cta_gplay: "Google Play",
    hero_social_proof: "Loved by barbers & clients",
    scroll_label: "Scroll",
    problem_badge: "The Problem",
    problem_title_1: "Waiting in line is ",
    problem_title_2: "wasted time.",
    problem_desc:
      "You show up, grab a number, and sit for an hour scrolling your phone — not knowing when your turn is. Or you call, get no answer, and drive over anyway. It's frustrating for clients and chaotic for barbers.",
    stat_1: "Average wait at a barbershop",
    stat_2: "Leave due to long waits",
    stat_3: "That's how it should feel",
    solution_badge: "The Solution",
    solution_title_1: "YoBarber makes waiting ",
    solution_title_2: "extinct.",
    solution_desc:
      "With real-time queue tracking, instant booking, and smart notifications — you'll always know exactly when to show up. No lines, no guessing, no wasted time.",
    sol_feat_1_title: "Live Queue Updates",
    sol_feat_1_desc:
      "See your position in real time, right from your phone.",
    sol_feat_2_title: "Smart Notifications",
    sol_feat_2_desc:
      "Get alerted when you're next — skip, swap, or confirm instantly.",
    sol_feat_3_title: "Instant Booking",
    sol_feat_3_desc:
      "Reserve your slot ahead of time. Walk in, sit down, done.",
    features_badge: "Core Features",
    features_title_1: "Everything you need.",
    features_title_2: "Nothing you don't.",
    features_subtitle:
      "Built for clients who value their time and barbers who want to run a smoother shop.",
    feat_1_title: "Smart Queue Management",
    feat_1_desc:
      "Track your live position in the queue. Receive skip & swap notifications so you never miss your turn.",
    feat_2_title: "Easy Booking & Scheduling",
    feat_2_desc:
      "Browse barbershops, check availability, and book your preferred time slot — all in a few taps.",
    feat_3_title: "Profile & History",
    feat_3_desc:
      "Keep track of your past visits, favorite barbers, and preferred styles — all saved in your profile.",
    feat_4_title: "Real-Time Updates",
    feat_4_desc:
      "Live status on every queue. See exactly how many people are ahead and estimated wait times.",
    feat_5_title: "Push Notifications",
    feat_5_desc:
      "Get instant alerts for booking confirmations, queue position changes, and when you're up next.",
    feat_6_title: "Barber Dashboard",
    feat_6_desc:
      "Barbers can manage their queue, view bookings, handle walk-ins, and keep their shop running smoothly.",
    how_badge: "How It Works",
    how_title_1: "Three steps to",
    how_title_2: "the perfect cut.",
    how_subtitle:
      "Whether you're a client or a barber, getting started takes under a minute.",
    how_clients_label: "For Clients",
    client_step_1_title: "Find Your Barber",
    client_step_1_desc:
      "Search nearby barbershops, check ratings, view live queue status, and pick your favorite.",
    client_step_2_title: "Book or Join Queue",
    client_step_2_desc:
      "Reserve a time slot in advance or jump into the live queue instantly — your choice.",
    client_step_3_title: "Show Up on Time",
    client_step_3_desc:
      "Get notified when your turn is near. Walk in, sit down, and enjoy the cut. Zero wait.",
    how_barbers_label: "For Barbers",
    barber_step_1_title: "Register Your Shop",
    barber_step_1_desc:
      "Create your barbershop profile, set your services, hours, and team members.",
    barber_step_2_title: "Manage Your Queue",
    barber_step_2_desc:
      "See all bookings and walk-ins in one dashboard. Reorder, skip, or call the next client.",
    barber_step_3_title: "Grow Your Business",
    barber_step_3_desc:
      "More visibility, happier clients, fewer no-shows. Let YoBarber bring clients to your chair.",
    download_badge: "Get the App",
    download_title_1: "Ready to skip ",
    download_title_2: "the line?",
    download_desc:
      "Download YoBarber now and never waste time in a waiting room again. Available on iOS and Android.",
    badge_appstore_label: "Download on the",
    badge_gplay_label: "Get it on",
    footer_desc:
      "The smartest way to book your barber and skip the line. Built for clients and barbers alike.",
    footer_product: "Product",
    footer_legal: "Legal",
    footer_privacy_link: "Privacy Policy",
    footer_connect: "Connect",
    footer_dev_website: "Developer Website",
    footer_contact: "Contact",
    footer_copyright: "© 2026 YoBarber. All rights reserved.",
    footer_built_by: "Built with ♥ by",
    toast_coming_soon_badge: "Coming Soon",
    toast_coming_soon_desc:
      "We're putting the finishing touches on the iOS app!",
  },

  fr: {
    nav_features: "Fonctionnalités",
    nav_how: "Comment ça marche",
    nav_download: "Télécharger",
    hero_badge: "Disponible maintenant",
    hero_title_1: "Fini la file,",
    hero_title_2: "Pas le style.",
    hero_subtitle:
      "Réservez votre coiffeur instantanément, suivez votre position dans la file en temps réel et présentez-vous pile au bon moment. Votre expérience barbershop, réinventée.",
    cta_appstore: "App Store",
    cta_gplay: "Google Play",
    hero_social_proof: "Adoré par les coiffeurs et clients",
    scroll_label: "Défiler",
    problem_badge: "Le Problème",
    problem_title_1: "Attendre en file, c'est du ",
    problem_title_2: "temps perdu.",
    problem_desc:
      "Vous arrivez, prenez un numéro et attendez une heure en scrollant — sans savoir quand ce sera votre tour. Ou vous appelez, pas de réponse, et vous y allez quand même. Frustrant pour les clients, chaotique pour les coiffeurs.",
    stat_1: "Attente moyenne chez le coiffeur",
    stat_2: "Partent à cause de l'attente",
    stat_3: "C'est ce que ça devrait être",
    solution_badge: "La Solution",
    solution_title_1: "YoBarber rend l'attente ",
    solution_title_2: "obsolète.",
    solution_desc:
      "Avec le suivi de file en temps réel, la réservation instantanée et les notifications intelligentes — vous saurez toujours exactement quand vous présenter. Plus de files, plus d'incertitudes.",
    sol_feat_1_title: "File en temps réel",
    sol_feat_1_desc:
      "Voyez votre position en direct, depuis votre téléphone.",
    sol_feat_2_title: "Notifications intelligentes",
    sol_feat_2_desc:
      "Soyez alerté quand c'est votre tour — passez, échangez ou confirmez instantanément.",
    sol_feat_3_title: "Réservation instantanée",
    sol_feat_3_desc:
      "Réservez votre créneau à l'avance. Arrivez, asseyez-vous, c'est fait.",
    features_badge: "Fonctionnalités clés",
    features_title_1: "Tout ce qu'il vous faut.",
    features_title_2: "Rien de superflu.",
    features_subtitle:
      "Conçu pour les clients qui respectent leur temps et les coiffeurs qui veulent un salon plus fluide.",
    feat_1_title: "Gestion intelligente de file",
    feat_1_desc:
      "Suivez votre position en direct. Recevez des notifications de passage et d'échange pour ne jamais rater votre tour.",
    feat_2_title: "Réservation facile",
    feat_2_desc:
      "Parcourez les salons, vérifiez les disponibilités et réservez votre créneau — en quelques clics.",
    feat_3_title: "Profil et historique",
    feat_3_desc:
      "Gardez un suivi de vos visites, coiffeurs préférés et styles favoris — tout dans votre profil.",
    feat_4_title: "Mises à jour en temps réel",
    feat_4_desc:
      "Statut en direct sur chaque file. Voyez combien de personnes vous précèdent et le temps d'attente estimé.",
    feat_5_title: "Notifications push",
    feat_5_desc:
      "Recevez des alertes pour les confirmations, changements de position et quand c'est votre tour.",
    feat_6_title: "Tableau de bord coiffeur",
    feat_6_desc:
      "Les coiffeurs peuvent gérer leur file, voir les réservations, les sans rendez-vous et faire tourner leur salon.",
    how_badge: "Comment ça marche",
    how_title_1: "Trois étapes vers",
    how_title_2: "la coupe parfaite.",
    how_subtitle:
      "Que vous soyez client ou coiffeur, commencer prend moins d'une minute.",
    how_clients_label: "Pour les clients",
    client_step_1_title: "Trouvez votre coiffeur",
    client_step_1_desc:
      "Recherchez les salons à proximité, consultez les avis et la file en direct, puis choisissez votre favori.",
    client_step_2_title: "Réservez ou rejoignez la file",
    client_step_2_desc:
      "Réservez un créneau à l'avance ou rejoignez la file en direct — à vous de choisir.",
    client_step_3_title: "Arrivez à l'heure",
    client_step_3_desc:
      "Recevez une notification quand votre tour approche. Entrez, asseyez-vous, profitez. Zéro attente.",
    how_barbers_label: "Pour les coiffeurs",
    barber_step_1_title: "Enregistrez votre salon",
    barber_step_1_desc:
      "Créez le profil de votre salon, définissez vos services, horaires et membres de l'équipe.",
    barber_step_2_title: "Gérez votre file",
    barber_step_2_desc:
      "Visualisez réservations et sans rendez-vous dans un seul tableau. Réordonnez, passez ou appelez le suivant.",
    barber_step_3_title: "Développez votre activité",
    barber_step_3_desc:
      "Plus de visibilité, des clients contents, moins de désistements. Laissez YoBarber remplir votre fauteuil.",
    download_badge: "Télécharger l'app",
    download_title_1: "Prêt à éviter ",
    download_title_2: "la file ?",
    download_desc:
      "Téléchargez YoBarber maintenant et ne perdez plus jamais de temps en salle d'attente. Disponible sur iOS et Android.",
    badge_appstore_label: "Télécharger sur",
    badge_gplay_label: "Disponible sur",
    footer_desc:
      "La manière la plus intelligente de réserver votre coiffeur et d'éviter la file. Conçu pour les clients et les coiffeurs.",
    footer_product: "Produit",
    footer_legal: "Légal",
    footer_privacy_link: "Politique de confidentialité",
    footer_connect: "Contact",
    footer_dev_website: "Site du développeur",
    footer_contact: "Contact",
    footer_copyright: "© 2026 YoBarber. Tous droits réservés.",
    footer_built_by: "Fait avec ♥ par",
    toast_coming_soon_badge: "Bientôt disponible",
    toast_coming_soon_desc: "Nous finalisons l'application iOS !",
  },

  ar: {
    nav_features: "المميزات",
    nav_how: "كيف يعمل",
    nav_download: "تحميل التطبيق",
    hero_badge: "متوفر الآن",
    hero_title_1: "تجاوز الطابور،",
    hero_title_2: "وليس أناقتك.",
    hero_subtitle:
      "احجز لدى حلاقك فوراً، وتتبّع موقعك في الطابور لحظة بلحظة، واحضر تماماً عندما يحين دورك. لقد تغيرت تجربة الحلاقة الخاصة بك.",
    cta_appstore: "آب ستور",
    cta_gplay: "جوجل بلاي",
    hero_social_proof: "محبوب من الحلاقين والعملاء",
    scroll_label: "مرّر",
    problem_badge: "المشكلة",
    problem_title_1: "الانتظار في الطابور ",
    problem_title_2: "وقت ضائع.",
    problem_desc:
      "تصل وتأخذ رقماً، وتنتظر ساعة تتصفح فيها هاتفك دون معرفة موعد دورك بالضبط. أو تتصل هاتفياً ولا أحد يجيب، فتذهب سدىً. هذا محبط للعملاء ومربك للحلاقين.",
    stat_1: "معدل الانتظار عند الحلاق",
    stat_2: "يغادرون بسبب طول الانتظار",
    stat_3: "كما ينبغي أن تكون",
    solution_badge: "الحل",
    solution_title_1: "YoBarber يجعل الانتظار ",
    solution_title_2: "منقرضاً.",
    solution_desc:
      "مع تتبع الطابور لحظة بلحظة، والحجز الفوري، والإشعارات الذكية — ستعرف دائماً متى تذهب بدقة. بلا طوابير، بلا تخمين، وبلا إضاعة للوقت.",
    sol_feat_1_title: "تحديثات الطابور المباشرة",
    sol_feat_1_desc:
      "شاهد موقعك في الطابور لحظة بلحظة، مباشرة من هاتفك.",
    sol_feat_2_title: "إشعارات ذكية",
    sol_feat_2_desc:
      "تلقّ تنبيهاً عندما يقترب دورك — مع إمكانية التجاوز، أو التبديل، أو التأكيد فوراً.",
    sol_feat_3_title: "حجز فوري",
    sol_feat_3_desc: "احجز مكانك مسبقاً. ادخل واجلس مباشرة.",
    features_badge: "المميزات الأساسية",
    features_title_1: "كل ما تحتاجه.",
    features_title_2: "ولا شي زيادة.",
    features_subtitle:
      "مصمم للعملاء الذين يقدّرون وقتهم وللحلاقين الساعين لتنظيم صالوناتهم.",
    feat_1_title: "إدارة ذكية للطابور",
    feat_1_desc:
      "تتبّع موقعك المباشر في الطابور. احصل على إشعارات التجاوز والتبديل لكي لا يفوتك دورك.",
    feat_2_title: "حجز وجدولة سهلة",
    feat_2_desc:
      "تصفّح الصالونات، واطلع على الأوقات المتاحة، واحجز الموعد الذي يناسبك بضغطات قليلة.",
    feat_3_title: "الملف الشخصي والتاريخ",
    feat_3_desc:
      "تابع زياراتك السابقة، وحلاقيك المفضلين، والتسريحات المفضلة لديك — كل شيء محفوظ في ملفك الشخصي.",
    feat_4_title: "تحديثات لحظية",
    feat_4_desc:
      "حالة مباشرة لكل طابور. اعرف بدقة عدد الأشخاص أمامك والوقت المتوقع لدورك.",
    feat_5_title: "إشعارات فورية",
    feat_5_desc:
      "احصل على تنبيهات فورية للتأكيدات، وتغييرات الترتيب، وعندما يحين دورك.",
    feat_6_title: "لوحة تحكم الحلاق",
    feat_6_desc:
      "بإمكان الحلاقين إدارة طوابيرهم، واستعراض الحجوزات، والتعامل مع العملاء الذين يحضرون دون موعد مسبق، لتسيير الصالون بكل سهولة.",
    how_badge: "كيف يعمل",
    how_title_1: "ثلاث خطوات نحو",
    how_title_2: "القصة الممتازة.",
    how_subtitle:
      "سواء كنت عميلاً أو حلاقاً، فإن البدء يستغرق أقل من دقيقة.",
    how_clients_label: "للعملاء",
    client_step_1_title: "ابحث عن حلاقك",
    client_step_1_desc:
      "ابحث عن الصالونات القريبة، واطلع على التقييمات وحالة الطابور المباشرة، ثم اختر صالونك المفضل.",
    client_step_2_title: "احجز أو انضم للطابور",
    client_step_2_desc:
      "احجز مسبقاً أو انضم إلى الطابور المباشر فوراً — الخيار لك.",
    client_step_3_title: "احضر في الوقت المناسب",
    client_step_3_desc:
      "ستتلقى إشعاراً عندما يقترب دورك. تفضل بالدخول، واجلس، واستمتع بجلسة الحلاقة. صفر انتظار.",
    how_barbers_label: "للحلاقين",
    barber_step_1_title: "سجل صالونك",
    barber_step_1_desc:
      "أنشئ ملف صالونك الخاص، وحدد الخدمات، والأوقات، وأعضاء فريق العمل.",
    barber_step_2_title: "أدر طابورك",
    barber_step_2_desc:
      "شاهد جميع الحجوزات والعملاء الذين حضروا دون موعد في لوحة تحكم واحدة. رتّب، أو تجاوز، أو نادِ على التالي.",
    barber_step_3_title: "نمّ أعمالك",
    barber_step_3_desc:
      "ظهور أوسع، عملاء سعداء، وتراجع في التغيبات. دع YoBarber يجلب العملاء لكرسي حلاقتك.",
    download_badge: "حمّل التطبيق",
    download_title_1: "مستعد تتجاوز ",
    download_title_2: "الطابور؟",
    download_desc:
      "حمّل تطبيق YoBarber الآن ولا تضيع وقتك في صالة الانتظار مجدداً. متوفر على نظامي iOS و Android.",
    badge_appstore_label: "تحميل من",
    badge_gplay_label: "متوفر على",
    footer_desc:
      "الطريقة الأذكى لحجز موعد حلاقك وتجاوز الطابور. مصمم للعملاء والحلاقين.",
    footer_product: "المنتج",
    footer_legal: "قانوني",
    footer_privacy_link: "سياسة الخصوصية",
    footer_connect: "تواصل",
    footer_dev_website: "موقع المطور",
    footer_contact: "اتصل بنا",
    footer_copyright: "© 2026 YoBarber. جميع الحقوق محفوظة.",
    footer_built_by: "صُنع بكل حب ♥ بواسطة",
    toast_coming_soon_badge: "قريباً",
    toast_coming_soon_desc: "نحن نضع اللمسات الأخيرة على تطبيق iOS!",
  },
};

export const SEO_DATA: Record<
  LangKey,
  { title: string; desc: string }
> = {
  en: {
    title:
      "YoBarber — Barber Queue Management & Barbershop Booking App | Skip the Line",
    desc: "YoBarber (Yo Barber) is the #1 barber queue management and barbershop booking app. Track your live queue position, book appointments instantly, and skip the line. Available on iOS & Android.",
  },
  fr: {
    title:
      "YoBarber — Gestion de file d'attente et réservation chez le coiffeur | Fini la file",
    desc: "YoBarber est l'application la plus intelligente pour gérer la file d'attente chez le coiffeur et réserver instantanément. Suivi en temps réel, notifications intelligentes. Disponible sur iOS et Android.",
  },
  ar: {
    title:
      "YoBarber — إدارة طابور الحلاق وحجز مواعيد الحلاقة | تجاوز الطابور",
    desc: "YoBarber هو التطبيق الأذكى لإدارة طابور الحلاق وحجز المواعيد فوراً. تتبع موقعك في الطابور لحظة بلحظة. متوفر على iOS و Android.",
  },
};

export const LANG_LABELS: Record<LangKey, string> = {
  en: "EN",
  fr: "FR",
  ar: "ع",
};
