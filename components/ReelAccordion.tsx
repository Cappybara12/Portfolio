"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Copy } from "lucide-react";
import type { Reel, ReelResource } from "@/lib/reels";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API can be blocked (in-app browsers - Instagram's, for
      // one, which is exactly where people will open this link). Fall back
      // to the old select-and-copy path so the button still works there.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* nothing more to try */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "copied" : "copy command"}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 border-2 border-indigo px-2.5 font-pixel text-xs tracking-wider text-indigo transition-colors hover:bg-indigo hover:text-ink"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "copied" : "copy"}
    </button>
  );
}

function Resource({ item }: { item: ReelResource }) {
  if (item.kind === "link") {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start justify-between gap-4 border-2 border-indigo/20 px-4 py-3 transition-colors hover:border-indigo hover:bg-indigo/5"
      >
        <span>
          <span className="block text-sm font-semibold text-bone group-hover:text-indigo sm:text-base">
            {item.title}
          </span>
          {item.description && (
            <span className="mt-1 block text-xs leading-relaxed text-bone/65 sm:text-sm">
              {item.description}
            </span>
          )}
        </span>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-indigo" aria-hidden />
      </a>
    );
  }

  if (item.kind === "command") {
    return (
      <div className="border-2 border-indigo/20 px-4 py-3">
        <p className="text-sm font-semibold text-bone sm:text-base">{item.title}</p>
        {item.description && (
          <p className="mt-1 text-xs leading-relaxed text-bone/65 sm:text-sm">
            {item.description}
          </p>
        )}
        <div className="mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <code className="min-w-0 flex-1 whitespace-pre-wrap break-all border-2 border-indigo/15 bg-indigo/5 px-3 py-2 font-mono text-xs text-bone sm:text-sm">
            {item.command}
          </code>
          <div className="sm:shrink-0">
            <CopyButton text={item.command} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-l-4 border-indigo/40 bg-indigo/5 px-4 py-3">
      <p className="font-pixel text-xs tracking-[0.2em] text-indigo sm:text-sm">
        {item.title}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-bone/75 sm:text-sm">
        {item.body}
      </p>
    </div>
  );
}

export default function ReelAccordion({ reels }: { reels: Reel[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Deep link: /reels-resources#veed-openedit opens that reel on arrival, so a
  // reply to one specific comment can link straight to the right dropdown.
  useEffect(() => {
    const slug = window.location.hash.replace(/^#/, "");
    if (slug && reels.some((r) => r.slug === slug)) {
      setOpenSlug(slug);
      requestAnimationFrame(() =>
        document.getElementById(slug)?.scrollIntoView({ block: "start" }),
      );
    }
  }, [reels]);

  const toggle = useCallback((slug: string) => {
    setOpenSlug((current) => {
      const next = current === slug ? null : slug;
      // Keep the URL shareable without adding a history entry per tap.
      window.history.replaceState(
        null,
        "",
        next ? `#${next}` : window.location.pathname,
      );
      return next;
    });
  }, []);

  return (
    <ul className="space-y-4">
      {reels.map((reel) => {
        const open = openSlug === reel.slug;
        const panelId = `${reel.slug}-resources`;
        return (
          <li key={reel.slug} id={reel.slug} className="scroll-mt-6 border-2 border-indigo/25">
            <button
              type="button"
              onClick={() => toggle(reel.slug)}
              aria-expanded={open}
              aria-controls={panelId}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-indigo/5 sm:px-6 sm:py-5"
            >
              <span>
                <time
                  dateTime={reel.date}
                  className="block font-pixel text-[10px] tracking-[0.2em] text-indigo/70 sm:text-xs"
                >
                  {new Date(reel.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="mt-1.5 block text-lg font-semibold text-bone sm:text-2xl">
                  {reel.title}
                </span>
                <span className="mt-1.5 block max-w-xl text-xs leading-relaxed text-bone/65 sm:text-sm">
                  {reel.summary}
                </span>
                <span className="mt-2 block font-pixel text-xs tracking-wider text-indigo">
                  {reel.resources.length} resources
                </span>
              </span>
              <ChevronDown
                aria-hidden
                className={`mt-1 h-5 w-5 shrink-0 text-indigo transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Height animates via grid rows (0fr -> 1fr); visibility flips
                after the collapse so closed links can't be tabbed to. */}
            <div
              id={panelId}
              role="region"
              aria-label={`${reel.title} resources`}
              aria-hidden={!open}
              className={`grid ${
                open
                  ? "visible grid-rows-[1fr] [transition:grid-template-rows_220ms_ease,visibility_0s]"
                  : "invisible grid-rows-[0fr] [transition:grid-template-rows_220ms_ease,visibility_0s_linear_220ms]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-3 border-t-2 border-indigo/20 px-5 py-5 sm:px-6">
                  {reel.reelUrl && (
                    <a
                      href={reel.reelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-pixel text-xs tracking-wider text-indigo hover:text-bone sm:text-sm"
                    >
                      watch the reel <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {reel.resources.map((item, i) => (
                    <Resource key={`${reel.slug}-${i}`} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
