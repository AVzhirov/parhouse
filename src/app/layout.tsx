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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
