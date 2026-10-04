"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

// Same approach as BlogThemeController: the home page locks scrolling for its
// horizontal pager, and `blog-mode` on <html> is what turns normal scrolling
// back on. Kept as its own component so the blog's header (which links to
// /blog) doesn't show up on a page that isn't part of it.
export default function ResourcesShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false); // light by default, like the blog

  useEffect(() => {
    const html = document.documentElement;
    const prevTheme = html.classList.contains("theme-dark")
      ? "theme-dark"
      : "theme-light";
    html.classList.add("blog-mode");
    return () => {
      html.classList.remove("blog-mode");
      html.classList.remove("theme-dark", "theme-light");
      html.classList.add(prevTheme);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(dark ? "theme-light" : "theme-dark");
    html.classList.add(dark ? "theme-dark" : "theme-light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-ink text-bone">
      <header className="flex items-center justify-between border-b-2 border-indigo/20 px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="font-pixel text-xs tracking-[0.2em] text-indigo hover:text-bone sm:text-sm sm:tracking-[0.3em]"
        >
          ← akshay.sharma
        </Link>
        <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
      </header>
      <main className="mx-auto max-w-2xl px-6 py-12 sm:px-10 sm:py-16">
        {children}
      </main>
    </div>
  );
}
