import type { Metadata } from "next";
import { VT323, Inter } from "next/font/google";
import "./globals.css";

const pixel = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akshay Kumar Sharma — Developer Relations Engineer",
  description:
    "Developer Relations engineer who builds communities and ships content.",
  metadataBase: new URL("https://akshaysharma.space"),
  openGraph: {
    title: "Akshay Kumar Sharma — Developer Relations Engineer",
    description:
      "Developer Relations engineer who builds communities and ships content.",
    url: "https://akshaysharma.space",
    siteName: "Akshay Kumar Sharma Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Kumar Sharma — Developer Relations Engineer",
    description:
      "Developer Relations engineer who builds communities and ships content.",
    creator: "@cappybaradeploy",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pixel.variable} ${body.variable}`}>
      <body className="bg-ink text-bone font-body antialiased">{children}</body>
    </html>
  );
}
