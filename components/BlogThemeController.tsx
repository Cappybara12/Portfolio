"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function BlogThemeController({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false); // white mode by default on /blog

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
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="font-pixel text-xs tracking-[0.2em] text-bone/60 hover:text-indigo sm:text-sm"
          >
            blog
          </Link>
          <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-10 sm:py-16">
        {children}
      </main>
    </div>
  );
}
