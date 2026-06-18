"use client";

/**
 * Extracts a LinkedIn URN from a post URL.
 * Handles both ugcPost-XXXX and activity-XXXX patterns.
 */
function urnFromUrl(url: string): string | null {
  const m = url.match(/(ugcPost|activity|share)-(\d+)/);
  if (!m) return null;
  return `urn:li:${m[1]}:${m[2]}`;
}

export default function LinkedInEmbed({
  url,
  caption,
}: {
  url: string;
  caption?: string;
}) {
  const urn = urnFromUrl(url);
  if (!urn) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="pixel-underline text-bone"
      >
        view post on linkedin →
      </a>
    );
  }
  const embed = `https://www.linkedin.com/embed/feed/update/${urn}?compact=1`;
  return (
    <figure className="pixel-border-indigo overflow-hidden bg-ink">
      <iframe
        src={embed}
        title={caption ?? "linkedin post"}
        height={520}
        width="100%"
        frameBorder={0}
        allowFullScreen
        loading="lazy"
        className="block"
      />
      {caption && (
        <figcaption className="border-t-2 border-indigo px-3 py-2 font-pixel text-sm tracking-widest text-indigo">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
