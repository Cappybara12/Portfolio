import type { Metadata } from "next";
import ResourcesShell from "@/components/ResourcesShell";

export const metadata: Metadata = {
  title: "Reel resources — Akshay Kumar Sharma",
  description:
    "Every tool, repo and link mentioned in my reels, in one place. Find the reel by name.",
  openGraph: {
    title: "Reel resources — Akshay Kumar Sharma",
    description:
      "Every tool, repo and link mentioned in my reels, in one place. Find the reel by name.",
    url: "https://dev-voyager.space/reels-resources",
    siteName: "Akshay Kumar Sharma Portfolio",
    type: "website",
  },
};

export default function ReelsResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResourcesShell>{children}</ResourcesShell>;
}
