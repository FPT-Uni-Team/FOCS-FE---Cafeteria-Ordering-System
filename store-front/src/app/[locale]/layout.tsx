import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "@/styles/globals.css";
import { routing } from "@/libs/i18n/routing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth/authOptions";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/store/ReduxProvider";

export const metadata: Metadata = {
  icons: [
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  return (
    <html lang={locale}>
      <body>
        <SessionProviderWrapper session={session}>
          <ReduxProvider>
            <NextIntlClientProvider>
              {props.children}
              <Toaster
                position="top-center"
                toastOptions={{
                  className: "text-sm",
                }}
              />
            </NextIntlClientProvider>
          </ReduxProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
