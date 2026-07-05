import type { Metadata } from "next";
import BlogThemeController from "@/components/BlogThemeController";

export const metadata: Metadata = {
  title: "Blog — Akshay Kumar Sharma",
  description:
    "Long-form articles on AI, developer tooling, and observability by Akshay Kumar Sharma.",
  openGraph: {
    title: "Blog — Akshay Kumar Sharma",
    description:
      "Long-form articles on AI, developer tooling, and observability by Akshay Kumar Sharma.",
    url: "https://dev-voyager.space/blog",
    siteName: "Akshay Kumar Sharma Portfolio",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogThemeController>{children}</BlogThemeController>;
}
