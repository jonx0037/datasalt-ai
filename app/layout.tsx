import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SaltyDogWidget } from "@/components/SaltyDog";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DataSalt — Seasoned AI. Sharp Results.",
  description:
    "Boutique AI/ML consultancy offering enterprise-grade machine learning and NLP services. We build, deploy, and deliver — not just advise.",
  metadataBase: new URL("https://datasalt.ai"),
  openGraph: {
    title: "DataSalt — Seasoned AI. Sharp Results.",
    description:
      "Applied AI/ML consulting from model to deployment. DataSalt brings enterprise-grade ML expertise to organizations that need real solutions.",
    url: "https://datasalt.ai",
    siteName: "DataSalt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataSalt — Seasoned AI. Sharp Results.",
    description: "Applied AI/ML consulting from model to deployment.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SaltyDogWidget />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
