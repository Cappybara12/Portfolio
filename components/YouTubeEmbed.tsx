"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export default function YouTubeEmbed({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [active, setActive] = useState(false);
  return (
    <div className="pixel-border-indigo group relative aspect-video w-full overflow-hidden bg-ink">
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="relative block h-full w-full text-left"
          aria-label={`Play ${title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            loading="lazy"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="pixel-border-indigo flex h-14 w-14 items-center justify-center bg-ink/80 text-indigo">
              <Play className="h-6 w-6" />
            </span>
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-3 py-2 font-pixel text-lg leading-tight text-bone">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
