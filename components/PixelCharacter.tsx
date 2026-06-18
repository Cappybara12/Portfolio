"use client";

import { useEffect, useState } from "react";

/**
 * 16×16 pixel DJ character — headphones + two-deck turntable console.
 *
 * Colour key
 *   S = suit / skin  (bone: white in dark mode, near-black in light)
 *   I = indigo       (headphones, visor, console buttons / platters)
 *   K = outline      (bone in dark, near-black in light — same tone as S but
 *                     used for borders so it reads correctly in both themes)
 *   . = transparent
 *
 * Layout (rows)
 *   0-1  : headphone band + ear cups
 *   2-4  : head + visor
 *   5-8  : upper body, arms spread reaching the decks
 *   9-13 : DJ console — two platters (I) separated by fader zone (S/K)
 *  14-15 : legs + feet visible below the console
 */

const P = 5; // px per pixel cell

type Frame = string[];

// ── Walk frame A (arms level) ──────────────────────────────────────────────
const WALK_A: Frame = [
  "...IIIIIIIIII...", // 0  headphone band
  "..II.KKKKKK.II..", // 1  ear cups
  "..IIKSSSSSSKII..", // 2  head with ear cups
  "....KSIIIISK....", // 3  face / visor
  "....KSSSSSSK....", // 4  chin
  "...KKSSSSSSKK...", // 5  shoulders
  ".KK..SSSSSS..KK.", // 6  arms spread outward
  "KK...SSSSSS...KK", // 7  arms reaching table
  "K....SSSSSS....K", // 8  hands at console level
  "KKKKKKKKKKKKKKKK", // 9  console top rail
  "KIIIIKSSSSKIIIIK", // 10 left platter | fader | right platter
  "KIIIIKSSSSKIIIIK", // 11
  "KSSSSKIIIIKSSSSK", // 12 bottom strip — knobs / EQ
  "KKKKKKKKKKKKKKKK", // 13 console base rail
  ".....KS.SK......", // 14 legs
  ".....KK.KK......", // 15 feet
];

// ── Walk frame B (left arm slightly raised — mixing gesture) ───────────────
const WALK_B: Frame = [
  "...IIIIIIIIII...", // 0
  "..II.KKKKKK.II..", // 1
  "..IIKSSSSSSKII..", // 2
  "....KSIIIISK....", // 3
  "....KSSSSSSK....", // 4
  "...KKSSSSSSKK...", // 5
  "KK...SSSSSS..KK.", // 6  left arm lower, right arm higher
  "KK...SSSSSS..KK.", // 7
  "KK...SSSSSS...KK", // 8
  "KKKKKKKKKKKKKKKK", // 9
  "KIIIIKSSSSKIIIIK", // 10
  "KIIIIKSSSSKIIIIK", // 11
  "KSSSSKIIIIKSSSSK", // 12
  "KKKKKKKKKKKKKKKK", // 13
  ".....KSS.K......", // 14 legs (shift for walk cycle)
  ".....KK..KK.....", // 15
];

// ── Jump frame (arms flung up — hype moment) ───────────────────────────────
const JUMP: Frame = [
  "...IIIIIIIIII...", // 0
  "..II.KKKKKK.II..", // 1
  "..IIKSSSSSSKII..", // 2
  "....KSIIIISK....", // 3
  "...KKSIIIISKK...", // 4  arms flying up
  "KSSKSSSSSSKSSKK.", // 5  hands raised high
  "KS...SSSSSS...SK", // 6  arms wide
  "K....SSSSSS....K", // 7  body
  "K....SSSSSS....K", // 8
  "KKKKKKKKKKKKKKKK", // 9  console stays put
  "KIIIIKSSSSKIIIIK", // 10
  "KIIIIKSSSSKIIIIK", // 11
  "KSSSSKIIIIKSSSSK", // 12
  "KKKKKKKKKKKKKKKK", // 13
  ".....KS.SK......", // 14
  ".....KK.KK......", // 15
];

// ── Renderer ───────────────────────────────────────────────────────────────
function FrameView({ frame, dark }: { frame: Frame; dark: boolean }) {
  const suit    = dark ? "rgb(255 255 255)" : "rgb(12 12 18)";
  const outline = dark ? "rgb(255 255 255)" : "rgb(12 12 18)";

  return (
    <div
      style={{
        width: 16 * P,
        height: 16 * P,
        position: "relative",
        imageRendering: "pixelated",
      }}
    >
      {frame.flatMap((row, y) =>
        row.split("").map((c, x) => {
          if (c === ".") return null;
          const bg =
            c === "I" ? "rgb(79 70 229)" :
            c === "K" ? outline :
            suit; // S
          return (
            <span
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * P,
                top: y * P,
                width: P,
                height: P,
                background: bg,
              }}
            />
          );
        }),
      )}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function PixelCharacter({
  jumping,
  dark,
}: {
  jumping: boolean;
  dark: boolean;
}) {
  const [walkFrame, setWalkFrame] = useState(0);

  useEffect(() => {
    if (jumping) return;
    const id = setInterval(() => setWalkFrame((f) => (f + 1) % 2), 300);
    return () => clearInterval(id);
  }, [jumping]);

  const frame = jumping ? JUMP : walkFrame === 0 ? WALK_A : WALK_B;

  return (
    <div
      style={{
        animation: jumping ? "jump-arc 600ms steps(8) 1" : undefined,
        filter: "drop-shadow(0 2px 0 rgb(79 70 229))",
      }}
    >
      <FrameView frame={frame} dark={dark} />
    </div>
  );
}
