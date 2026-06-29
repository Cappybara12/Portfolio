"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TRACKS } from "@/lib/tracks";

type Props = {
  id: string;
  index: number;
  active: number;
  title?: string;
  titleHref?: string;
  kicker?: string;
  children: React.ReactNode;
};

export default function Section({
  id,
  index,
  active,
  title,
  titleHref,
  kicker,
  children,
}: Props) {
  const isActive = index === active;
  const delta = index - active;
  const trackNum = TRACKS[index]?.id ?? String(index).padStart(2, "0");

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollMore, setCanScrollMore] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setCanScrollMore(
        el.scrollHeight > el.clientHeight + 8 &&
          el.scrollTop + el.clientHeight < el.scrollHeight - 8
      );
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, []);

  // Re-check once the slide-in animation settles (600 ms)
  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollMore(
        el.scrollHeight > el.clientHeight + 8 &&
          el.scrollTop + el.clientHeight < el.scrollHeight - 8
      );
    }, 650);
    return () => clearTimeout(t);
  }, [isActive]);

  return (
    <section
      id={id}
      data-index={index}
      className="relative flex h-screen w-screen flex-shrink-0 flex-col px-4 pt-16 sm:px-6 sm:pt-20 md:pt-28 md:px-16"
      style={{ scrollSnapAlign: "start" }}
    >
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0.15,
          x: isActive ? 0 : delta < 0 ? -40 : 40,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex h-full w-full max-w-[1180px] flex-col"
        style={{ paddingBottom: "var(--section-pb)" }}
      >
        {title && (
          <header className="mb-4 sm:mb-8 md:mb-10 shrink-0">
            <div className="mb-1.5 sm:mb-3 flex items-center gap-2 sm:gap-3 font-pixel text-xs sm:text-base tracking-[0.25em] sm:tracking-[0.3em] text-indigo">
              <span className="inline-block h-2 w-2 bg-indigo" />
              track {trackNum}
              {kicker && <span className="text-bone/40">// {kicker}</span>}
            </div>
            <h2 className="font-pixel text-2xl sm:text-4xl md:text-7xl leading-none tracking-wider">
              {titleHref ? (
                <a
                  href={titleHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-bone glow-indigo underline underline-offset-8 decoration-2 decoration-indigo transition-colors hover:text-indigo"
                >
                  {title}
                </a>
              ) : (
                <span className="text-bone glow-indigo">{title}</span>
              )}
            </h2>
            <div className="mt-2 sm:mt-4 h-[2px] w-16 sm:w-24 bg-indigo" />
          </header>
        )}

        {/* Scrollable content */}
        <motion.div
          ref={scrollRef}
          variants={{
            hidden: {},
            shown: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
          initial="hidden"
          animate={isActive ? "shown" : "hidden"}
          className="min-h-0 flex-1 overflow-y-auto pr-2"
          data-scroll-area="1"
        >
          {children}
        </motion.div>

        {/*
         * ── Disc-shaped bottom arc ──────────────────────────────────────────
         * Sits in the padding-bottom gap reserved for the PixelCD.
         * Very wide element + elliptical top border-radius → semicircle arc
         * that mirrors the spinning disc below.
         * gradient fade prevents a hard edge at the curve.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-[6]"
          style={{
            bottom: 0,
            width: "220vw",
            height: "var(--section-pb)",
            transform: "translateX(-50%)",
            borderRadius:
              "50% 50% 0 0 / var(--section-pb-radius) var(--section-pb-radius) 0 0",
            background:
              "linear-gradient(to bottom, transparent 0%, rgb(var(--ink)) 32%)",
          }}
        />

        {/* Centre bounce arrow — floats just above the arc's curved edge */}
        {isActive && canScrollMore && (
          <div
            className="pointer-events-none absolute left-0 right-0 z-10 flex flex-col items-center gap-0.5"
            style={{ bottom: "calc(var(--section-pb) - 2px)" }}
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="glow-indigo text-lg text-indigo"
            >
              ↓
            </motion.div>
          </div>
        )}

        {/* bottom-right nudge lives in page.tsx as a fixed viewport element */}
      </motion.div>
    </section>
  );
}

export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        shown: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
