import type React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

// 1. Importamos nosso novo componente "invólucro"
import { Providers } from "@/components/providers"; 
// Note que os imports de Toaster e Analytics foram REMOVIDOS daqui.

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stadio Finance ⚽",
  description: "Gamified financial tracking with a football theme",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {/* 2. Usamos o <Providers> para "abraçar" o conteúdo do seu site */}
        <Providers> 
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </Providers> 
        {/* As linhas do <Toaster /> e <Analytics /> foram REMOVIDAS daqui */}
      </body>
    </html>
  );
}