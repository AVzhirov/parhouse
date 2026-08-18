import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://parhouse55.ru'),
  title: "ПАР ХАУС — Производство бань и саун под ключ",
  description:
    "Строим бани, которые дышат. Инженерные решения для русского пара. Собственное производство, гарантия 1 год, монтаж под ключ в Омске и Омской области.",
  keywords: [
    "бани",
    "сауны",
    "ПАР ХАУС",
    "бани под ключ",
    "сауны Омск",
    "термодерево",
    "барельефные бани",
    "производство бань",
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
    title: "ПАР ХАУС — Производство бань и саун под ключ",
    description: "Строим бани, которые дышат. Инженерные решения для русского пара.",
    images: ["/hero-bg.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "ПАР ХАУС — Производство бань и саун под ключ",
    description:
      "Строим бани, которые дышат. Инженерные решения для русского пара.",
    type: "website",
    images: [{ url: "/hero-bg.webp", width: 1344, height: 768 }],
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
              description: "Производство и монтаж бань и саун под ключ в Омске",
              telephone: "+79048220007",
              email: "parhouse_55@mail.ru",
              url: "https://parhouse55.ru",
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
              priceRange: "₽₽",
              image: "/logo.webp",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
            style={{ width: 120, height: "auto", objectFit: "contain" }}
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
