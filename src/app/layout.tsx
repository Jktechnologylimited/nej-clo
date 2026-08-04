import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nej Clothing",
  description:
    "Independent streetwear label. Guerrilla releases, limited runs, no restock guaranteed.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, currency] = await Promise.all([getLocale(), getCurrency()]);

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${jetbrainsMono.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-bg text-paper antialiased">
        <I18nProvider initialLocale={locale} initialCurrency={currency}>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
