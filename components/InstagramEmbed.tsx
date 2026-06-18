"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let loaded = false;

function loadScript() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.instagram.com/embed.js";
  document.body.appendChild(s);
}

export default function InstagramEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadScript();
    const t = setTimeout(() => {
      window.instgrm?.Embeds.process();
    }, 600);
    return () => clearTimeout(t);
  }, [url]);

  return (
    <div ref={ref} className="pixel-border-indigo p-1">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "rgb(var(--ink))",
          border: 0,
          margin: 0,
          minWidth: 240,
          width: "100%",
        }}
      >
        <a href={url} target="_blank" rel="noreferrer" className="text-bone">
          view on instagram →
        </a>
      </blockquote>
    </div>
  );
}
