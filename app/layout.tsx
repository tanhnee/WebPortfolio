import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/common/Providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MaivenPoint AI | Le Buu Tanh Portfolio",
    template: "%s | MaivenPoint AI",
  },
  description:
    "Portfolio of Le Buu Tanh — Business Analyst, Data Analyst & AI Solution Builder specializing in AI, Data Analytics, and Business Intelligence.",
  keywords: [
    "Le Buu Tanh",
    "MaivenPoint AI",
    "Business Analyst",
    "Data Analyst",
    "AI",
    "Portfolio",
    "E-commerce",
    "Information Systems",
  ],
  authors: [{ name: "Le Buu Tanh" }],
  creator: "Le Buu Tanh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maivenpoint.ai",
    title: "MaivenPoint AI | Le Buu Tanh Portfolio",
    description:
      "Portfolio of Le Buu Tanh — Business Analyst, Data Analyst & AI Solution Builder",
    siteName: "MaivenPoint AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "MaivenPoint AI | Le Buu Tanh Portfolio",
    description: "Portfolio of Le Buu Tanh — Business Analyst & AI Builder",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0E1628",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F8FAFC",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
