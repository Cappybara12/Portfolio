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
    "Developer Relations engineer who builds communities and ships content. Co-founder of Wayzyy (wayzyy.com), a short-term rental marketplace in India.",
  metadataBase: new URL("https://dev-voyager.space"),
  openGraph: {
    title: "Akshay Kumar Sharma — Developer Relations Engineer",
    description:
      "Developer Relations engineer who builds communities and ships content.",
    url: "https://dev-voyager.space",
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

const personJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://dev-voyager.space/#akshay",
      name: "Akshay Kumar Sharma",
      url: "https://dev-voyager.space",
      jobTitle: "Co-founder & CTO, Wayzyy; Developer Relations Engineer",
      sameAs: [
        "https://www.linkedin.com/in/akshay-kumar-sharma-37aa55256/",
        "https://x.com/cappybaradeploy",
        "https://github.com/akshayne912",
        "https://instagram.com/akshayat.it",
      ],
      worksFor: { "@id": "https://wayzyy.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://wayzyy.com/#organization",
      name: "Wayzyy",
      url: "https://wayzyy.com",
      description:
        "Wayzyy is a short-term rental marketplace in India, starting in Goa, with verified hosts.",
      founder: [
        { "@id": "https://dev-voyager.space/#akshay" },
        { "@id": "https://wayzyy.com/about#anant" },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pixel.variable} ${body.variable}`}>
      <body className="bg-ink text-bone font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
