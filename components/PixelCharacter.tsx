"use client";

import { useEffect, useState } from "react";

/**
 * 16×16 pixel DJ character — modelled after Akshay Kumar Sharma.
 *
 * Colour key
 *   H = hair        dark warm-brown (#2D1505 dark-mode / #1A0F08 light)
 *   N = skin        warm brown #C8956C  (fixed, theme-independent)
 *   I = indigo      headphones / console platters
 *   K = outline     dark shirt / rails  (near-black, theme-adaptive)
 *   S = bone        console fader area  (theme-adaptive white/cream)
 *   . = transparent
 *
 * Layout (rows)
 *   0    : hair — full crown coverage
 *   1    : headphone band running across hair
 *   2    : headphone ear cups + sides of head
 *   3-4  : face — curtain bangs framing sides
 *   5    : nose / mid-face
 *   6    : chin — beard stubble on sides (H pixels)
 *   7    : shirt collar — open, showing neck skin
 *   8-9  : arms spread to reach the decks
 *  10-14 : DJ console — two platters, fader, knobs
 *  15   : legs
 */

const P = 5; // px per pixel cell

type Frame = string[];

// ── Walk frame A (arms level) ──────────────────────────────────────────────
const WALK_A: Frame = [
  "HHHHHHHHHHHHHHHH", // 0  full dark hair crown
  "HHHIIIIIIIIIIHHH", // 1  headphone band over hair (3H+10I+3H)
  "..IIHNNNNNNHII..", // 2  ear cups (I), hair-side (H), skin face (N)
  "..HHHNNNNNNHHH..", // 3  curtain bangs heavy framing
  "...HHNNNNNNHH...", // 4  face mid — bangs tapering
  "....NNNNNNNN....", // 5  nose / mid-face
  "....HNNNNNNH....", // 6  jaw — beard stubble (H) on sides
  "...KKNNNNNNKK...", // 7  dark shirt collar, neck skin (N) showing
  ".KK..KKKKKK..KK.", // 8  arms spread (dark shirt sleeves)
  "KK...KKKKKK...KK", // 9  hands at console
  "KKKKKKKKKKKKKKKK", // 10 console top rail
  "KIIIIKSSSSKIIIIK", // 11 left platter | fader | right platter
  "KIIIIKSSSSKIIIIK", // 12
  "KSSSSKIIIIKSSSSK", // 13 knobs / EQ row
  "KKKKKKKKKKKKKKKK", // 14 console base rail
  ".....KK.KK......", // 15 legs (dark pants)
];

// ── Walk frame B (left arm slightly raised — mixing gesture) ───────────────
const WALK_B: Frame = [
  "HHHHHHHHHHHHHHHH", // 0
  "HHHIIIIIIIIIIHHH", // 1
  "..IIHNNNNNNHII..", // 2
  "..HHHNNNNNNHHH..", // 3
  "...HHNNNNNNHH...", // 4
  "....NNNNNNNN....", // 5
  "....HNNNNNNH....", // 6
  "...KKNNNNNNKK...", // 7
  "KK...KKKKKK..KK.", // 8  left arm lower / right arm higher
  "KK...KKKKKK..KK.", // 9
  "KKKKKKKKKKKKKKKK", // 10
  "KIIIIKSSSSKIIIIK", // 11
  "KIIIIKSSSSKIIIIK", // 12
  "KSSSSKIIIIKSSSSK", // 13
  "KKKKKKKKKKKKKKKK", // 14
  ".....KNN.K......", // 15 walk-cycle leg shift
];

// ── Jump frame (arms flung up — hype moment) ───────────────────────────────
const JUMP: Frame = [
  "HHHHHHHHHHHHHHHH", // 0
  "HHHIIIIIIIIIIHHH", // 1
  "..IIHNNNNNNHII..", // 2
  "..HHHNNNNNNHHH..", // 3
  "...HHNNNNNNHH...", // 4
  "KN..NNNNNNNN..NK", // 5  arms flying up — hands visible at face level
  "K...HNNNNNNH...K", // 6
  "K..KKNNNNNNKK..K", // 7
  "K....KKKKKK....K", // 8  body
  "K....KKKKKK....K", // 9
  "KKKKKKKKKKKKKKKK", // 10
  "KIIIIKSSSSKIIIIK", // 11
  "KIIIIKSSSSKIIIIK", // 12
  "KSSSSKIIIIKSSSSK", // 13
  "KKKKKKKKKKKKKKKK", // 14
  ".....KN.NK......", // 15
];

// ── Renderer ───────────────────────────────────────────────────────────────
function FrameView({ frame, dark }: { frame: Frame; dark: boolean }) {
  // S and K stay theme-adaptive (used for console / shirt outline)
  const bone    = dark ? "rgb(255 255 255)" : "rgb(12 12 18)";
  const outline = dark ? "rgb(200 200 210)" : "rgb(10 10 20)";
  // Hair: warm dark brown — slightly lighter in dark mode so it reads against black bg
  const hair    = dark ? "#3D2810" : "#1A0F08";
  // Skin: warm brown — fixed regardless of theme
  const skin    = "#C8956C";

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
            c === "H" ? hair :
            c === "N" ? skin :
            c === "K" ? outline :
            bone; // S — console bone/fader area
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
