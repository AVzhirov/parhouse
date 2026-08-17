import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ПАР ХАУС — Производство бань и саун под ключ",
  description:
    "Строим бани, которые дышат. Инженерные решения для русского пара. Собственное производство, гарантия 5 лет, монтаж под ключ в Омске и Омской области.",
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
    icon: "/logo.png",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vk.com" />
        <link rel="preconnect" href="https://yandex.ru" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'ПАР ХАУС',
              description: 'Производство и монтаж бань и саун под ключ в Омске',
              telephone: '+79048220007',
              email: 'info@parhouse55.ru',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'ул. Тополиная, 31',
                addressLocality: 'Омск',
                addressRegion: 'Омская область',
                addressCountry: 'RU',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 55.0971,
                longitude: 73.3705,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '09:00',
                  closes: '18:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday'],
                  opens: '10:00',
                  closes: '16:00',
                },
              ],
              priceRange: '₽₽',
              image: '/logo.png',
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <noscript>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#C68E4E', fontSize: '1.2rem' }}>
            Для работы сайта необходим включённый JavaScript. Позвоните нам: <a href="tel:+79048220007" style={{ color: '#C68E4E' }}>+7 (904) 822-00-07</a>
          </div>
        </noscript>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
