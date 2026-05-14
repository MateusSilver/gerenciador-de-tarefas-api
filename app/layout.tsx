import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerenciador de tarefas com API",
  description:
    "Organize sua rotina de forma eficiente com nosso gerenciador de tarefas. Com API robusta, você pode criar, atualizar e excluir tarefas facilmente. Mantenha-se produtivo e no controle do seu dia a dia!",
  keywords: [
    "gerenciador de tarefas",
    "API de tarefas",
    "organização de tarefas",
    "produtividade",
    "controle de tarefas",
    "aplicativo de tarefas",
    "tarefas diárias",
    "gerenciamento de tempo",
    "tarefas pendentes",
    "tarefas concluídas",
  ],
  authors: [
    {
      name: "Mateus da Silveira Batista",
      url: "https://github.com/MateusSilver",
    },
  ],
  openGraph: {
    title: "Gerenciador de tarefas com API",
    description:
      "Organize sua rotina de forma eficiente com nosso gerenciador de tarefas.",
    url: "https://gerenciador-de-tarefas-com-api.vercel.app", //trocar depois do deploy
    siteName: "Gerenciador de tarefas com API",
    images: [
      {
        url: "/og-image.jpg",
        width: 1100,
        height: 540,
        alt: "Gerenciador de tarefas com API - Organize sua rotina de forma eficiente",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${geistSans.className} h-full`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
