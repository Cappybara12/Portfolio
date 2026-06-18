"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    twttr?: { widgets: { load: (el?: HTMLElement) => void } };
  }
}

let loaded = false;
function loadScript() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://platform.twitter.com/widgets.js";
  document.body.appendChild(s);
}

export default function XEmbed({ url }: { url: string }) {
  useEffect(() => {
    loadScript();
    const t = setTimeout(() => window.twttr?.widgets.load(), 600);
    return () => clearTimeout(t);
  }, [url]);

  return (
    <div className="pixel-border-indigo bg-ink p-3">
      <blockquote className="twitter-tweet" data-theme="dark" data-dnt="true">
        <a href={url}>view post on x</a>
      </blockquote>
    </div>
  );
}
