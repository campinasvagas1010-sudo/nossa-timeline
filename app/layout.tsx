import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Nosso Timeline - Transforme sua conversa do WhatsApp em uma história incrível",
  description: "Envie sua conversa do WhatsApp e crie automaticamente uma linha do tempo com momentos marcantes, estatísticas e cards prontos para compartilhar nas redes sociais.",
  keywords: ["whatsapp", "timeline", "história", "conversa", "casal", "amizade", "análise"],
  authors: [{ name: "Nosso Timeline" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://nossotimeline.com",
    title: "Nosso Timeline - Transforme sua conversa do WhatsApp em uma história incrível",
    description: "Envie sua conversa do WhatsApp e crie automaticamente uma linha do tempo com momentos marcantes, estatísticas e cards prontos para compartilhar.",
    siteName: "Nosso Timeline",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosso Timeline - Transforme sua conversa do WhatsApp em uma história incrível",
    description: "Envie sua conversa do WhatsApp e crie automaticamente uma linha do tempo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
