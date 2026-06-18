"use client";

import { useMemo } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  color: "fg" | "indigo";
  delay: number;
  dur: number;
};

function seeded(n: number) {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function Starfield({ dark }: { dark: boolean }) {
  const stars = useMemo<Star[]>(() => {
    const r = seeded(42);
    const arr: Star[] = [];
    for (let i = 0; i < 80; i++) {
      arr.push({
        x: r() * 100,
        y: r() * 100,
        size: r() > 0.85 ? 3 : 2,
        color: r() > 0.82 ? "indigo" : "fg",
        delay: r() * 6,
        dur: 3 + r() * 4,
      });
    }
    return arr;
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 pixel-grid">
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background:
              s.color === "indigo"
                ? "rgb(var(--indigo))"
                : `rgb(var(--bone) / ${dark ? 0.85 : 0.35})`,
            animation: `twinkle ${s.dur}s steps(4) ${s.delay}s infinite`,
          }}
          className="absolute"
        />
      ))}
    </div>
  );
}
