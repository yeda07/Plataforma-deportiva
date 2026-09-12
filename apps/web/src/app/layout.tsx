import type { Metadata } from "next";
import { BottomNavigation, PageContainer, SportsNavigation, TopNavigation } from "@components";
import { webEnv } from "@/lib/env";
import { AppProviders } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: webEnv.appName,
  description: "Plataforma deportiva de competencias, predicciones gratuitas, puntos, logros y rankings.",
  metadataBase: new URL(webEnv.webUrl),
  openGraph: {
    description: "Compite con predicciones gratuitas, sigue eventos deportivos y escala rankings de comunidad.",
    locale: "es_CO",
    siteName: webEnv.appName,
    title: webEnv.appName,
    type: "website",
    url: webEnv.webUrl
  },
  robots: {
    follow: true,
    index: true
  },
  title: {
    default: webEnv.appName,
    template: `%s | ${webEnv.appName}`
  }
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <AppProviders>
          <TopNavigation />
          <SportsNavigation />
          <PageContainer>{children}</PageContainer>
          <BottomNavigation />
        </AppProviders>
      </body>
    </html>
  );
}
