"use client";

import { useState } from "react";
import { Play } from "lucide-react";

function idFromUrl(url: string) {
  const m = url.match(/shorts\/([A-Za-z0-9_-]+)/) ?? url.match(/embed\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : url;
}

export default function YouTubeShortEmbed({ url }: { url: string }) {
  const id = idFromUrl(url);
  const [on, setOn] = useState(false);
  return (
    <div
      className="pixel-border-indigo relative w-full overflow-hidden bg-ink"
      style={{ aspectRatio: "9 / 16" }}
    >
      {on ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title="youtube short"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          onClick={() => setOn(true)}
          className="group block h-full w-full text-left"
          aria-label="play short"
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt="short thumbnail"
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            loading="lazy"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="pixel-border-indigo flex h-12 w-12 items-center justify-center bg-ink/80 text-indigo">
              <Play className="h-5 w-5" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
