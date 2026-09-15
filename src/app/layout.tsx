import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL('https://parhouse55.ru'),
  title: "ПАР ХАУС — Производство бань и саун под ключ",
  description:
    "Производство бань и саун под ключ в Омске. Каркасные бани, бани из бруса, мобильные бани. Собственное производство, гарантия 1 год, доставка и монтаж по Омску и Омской области. ПАР ХАУС.",
  keywords: [
    "бани омск",
    "сауны омск",
    "производство бань омск",
    "бани под ключ омск",
    "каркасная баня омск",
    "баня из бруса омск",
    "мобильная баня омск",
    "баня на заказ омск",
    "строительство бань омск",
    "бани омская область",
    "сауна под ключ омск",
    "термодерево",
    "кедровый брус",
    "пар хаус",
    "ПАР ХАУС",
    "дачный домик омск",
    "монтаж бани омск",
    "доставка бани омск",
    "баня цена омск",
    "купить баню омск",
  ],
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ПАР ХАУС — Производство бань и саун под ключ в Омске",
    description: "Производство бань и саун под ключ в Омске. Каркасные бани, бани из бруса, мобильные бани. Гарантия 1 год.",
    images: ["/hero-bg.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "ПАР ХАУС — Производство бань и саун под ключ в Омске",
    description:
      "Производство бань и саун под ключ в Омске. Каркасные бани, бани из бруса, мобильные бани. Гарантия 1 год, доставка и монтаж.",
    type: "website",
    images: [{ url: "/hero-bg.webp", width: 1536, height: 1024 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1A1A1A" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preload" as="image" href="/logo.webp" type="image/webp" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="preload"
          as="image"
          href="/hero-bg.webp"
          type="image/webp"
          media="(min-width: 801px)"
        />
        <link
          rel="preload"
          as="image"
          href="/hero-bg-sm.webp"
          type="image/webp"
          media="(max-width: 800px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "ПАР ХАУС",
              description: "Производство и монтаж бань и саун под ключ в Омске и Омской области",
              telephone: "+79048220007",
              email: "parhouse_55@mail.ru",
              url: "https://parhouse55.ru",
              taxID: "550726246970",
              founder: {
                "@type": "Person",
                name: "Арзамасов Роман Борисович",
                jobTitle: "Индивидуальный предприниматель",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "ул. Тополиная, 31",
                addressLocality: "Омск",
                addressRegion: "Омская область",
                addressCountry: "RU",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 55.0971,
                longitude: 73.3705,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "09:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday"],
                  opens: "10:00",
                  closes: "16:00",
                },
              ],
              priceRange: "от 125 000 ₽",
              image: "/logo.webp",
              datePublished: "2024-01-01",
              dateModified: "2026-09-14",
              author: {
                "@type": "Organization",
                name: "ПАР ХАУС",
                url: "https://parhouse55.ru",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ПАР ХАУС",
              url: "https://parhouse55.ru",
              description: "Производство и монтаж бань и саун под ключ в Омске и Омской области",
              publisher: {
                "@type": "Organization",
                name: "ИП Арзамасов Р.Б.",
                taxID: "550726246970",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                { "@type": "Question", name: "Сколько стоит баня под ключ?", acceptedAnswer: { "@type": "Answer", text: "Стоимость зависит от размеров и комплектации. Базовые модели начинаются от 320 000 ₽. Точную стоимость рассчитаем после консультации — это бесплатно." } },
                { "@type": "Question", name: "Какой срок изготовления?", acceptedAnswer: { "@type": "Answer", text: "Стандартный срок производства — 2-4 недели в зависимости от сложности проекта. Монтаж на участке занимает 1-3 дня." } },
                { "@type": "Question", name: "Какую древесину вы используете?", acceptedAnswer: { "@type": "Answer", text: "Работаем с термически модифицированной древесиной: лиственницу, липу и сосну. Также используем кедровый мини брус." } },
                { "@type": "Question", name: "Есть ли доставка и монтаж?", acceptedAnswer: { "@type": "Answer", text: "Да, осуществляем доставку по Омску и Омской области. Монтаж выполняют наши специалисты с соблюдением всех технологических норм." } },
                { "@type": "Question", name: "Какая гарантия на продукцию?", acceptedAnswer: { "@type": "Answer", text: "Предоставляем гарантию 1 год на все конструкции и инженерные системы. Также даём рекомендации по уходу." } },
                { "@type": "Question", name: "Можно ли заказать индивидуальный проект?", acceptedAnswer: { "@type": "Answer", text: "Конечно! Разработаем 3D-проект с учётом всех ваших пожеланий и особенностей участка. Проектирование включено в стоимость." } },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Inline preloader - visible before React hydrates */}
        <div
          id="preloader"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#1A1A1A",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            transition: "opacity 0.6s ease, visibility 0.6s ease",
          }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes preloader-steam {
                  0% { opacity: 0; transform: translateY(0) scale(0.8); }
                  50% { opacity: 0.6; }
                  100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
                }
                @keyframes preloader-pulse {
                  0%, 100% { opacity: 0.4; transform: scale(1); }
                  50% { opacity: 0.8; transform: scale(1.05); }
                }
                @keyframes preloader-text {
                  0% { opacity: 0; letter-spacing: 0.3em; }
                  100% { opacity: 1; letter-spacing: 0.15em; }
                }
                #preloader .steam-particle {
                  position: absolute;
                  border-radius: 50%;
                  background: #C68E4E;
                  filter: blur(8px);
                  animation: preloader-steam 2s ease-out infinite;
                }
                #preloader .logo-glow {
                  animation: preloader-pulse 2s ease-in-out infinite;
                }
                #preloader .brand-text {
                  animation: preloader-text 1.2s ease-out forwards;
                  animation-delay: 0.3s;
                  opacity: 0;
                }
              `,
            }}
          />
          {/* Steam particles */}
          <div className="steam-particle" style={{ width: 20, height: 20, left: "calc(50% - 30px)", top: "calc(50% - 20px)", animationDelay: "0s" }} />
          <div className="steam-particle" style={{ width: 16, height: 16, left: "calc(50% + 10px)", top: "calc(50% - 15px)", animationDelay: "0.7s" }} />
          <div className="steam-particle" style={{ width: 12, height: 12, left: "calc(50% - 5px)", top: "calc(50% - 25px)", animationDelay: "1.3s" }} />
          {/* Logo */}
          <img
            src="/logo.webp"
            alt=""
            className="logo-glow"
            style={{ width: 200, height: "auto", objectFit: "contain" }}
          />
          {/* Brand text */}
          <div
            className="brand-text"
            style={{
              color: "#C68E4E",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Производство бань и саун
          </div>
        </div>

        {/* Splash screen — shows ПАР ХАУС branding, removed by JS */}
        <div
          id="splash"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: '#1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.5s ease',
          }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes splash-fadein {
                  0% { opacity: 0; transform: scale(0.95); }
                  100% { opacity: 1; transform: scale(1); }
                }
                #splash .splash-brand {
                  animation: splash-fadein 0.6s ease-out forwards;
                }
              `,
            }}
          />
          <div
            className="splash-brand"
            style={{
              color: '#C68E4E',
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            ПАР ХАУС
          </div>
        </div>

        {/* Yandex.Metrika — загружается только после согласия на cookie */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function loadMetrika(id) {
                if (typeof id !== 'number') return;
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                ym(id, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, triggerEvent:true });
                var noscript = document.createElement("noscript");
                var img = document.createElement("img");
                img.src = "https://mc.yandex.ru/watch/" + id;
                img.style.cssText = "position:absolute; left:-9999px;";
                img.alt = "";
                noscript.appendChild(img);
                document.body.appendChild(noscript);
              }
              document.addEventListener("DOMContentLoaded", function() {
                if (localStorage.getItem("parhouse_cookie_consent") === "accepted") {
                  loadMetrika(44147844);
                }
                window.__loadTrackers = function() {
                  if (localStorage.getItem("parhouse_cookie_consent") === "accepted") {
                    loadMetrika(44147844);
                  }
                };
              });
            `,
          }}
        />

        <noscript>
          <div style={{ padding: "2rem", textAlign: "center", color: "#C68E4E", fontSize: "1.2rem" }}>
            Для работы сайта необходим включённый JavaScript. Позвоните нам: <a href="tel:+79048220007" style={{ color: "#C68E4E" }}>+7 (904) 822-00-07</a>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
