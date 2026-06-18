"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PixelCharacter from "./PixelCharacter";

type Props = {
  label: string;
  activeTrack: number;
  dark: boolean;
};

/**
 * Layered transform stack:
 *   wrapper       → perspective
 *   tilt          → rotateX(18deg)              static
 *   step          → rotateZ(activeTrack * 72°)  animates on track change (DJ scratch)
 *   spin          → rotateZ(0 → 360°)           continuous 20s loop
 *   disc art      → SVG content
 *
 * Step and spin compose: visible rotation = step + spin.
 */
export default function PixelCD({ label, activeTrack, dark }: Props) {
  const [jumping, setJumping] = useState(false);
  const last = useRef(activeTrack);

  useEffect(() => {
    if (last.current === activeTrack) return;
    last.current = activeTrack;
    setJumping(true);
    const t = setTimeout(() => setJumping(false), 600);
    return () => clearTimeout(t);
  }, [activeTrack]);

  const stepAngle = activeTrack * 72;

  return (
    <div className="pointer-events-none fixed bottom-0 left-1/2 z-20 -translate-x-1/2 select-none">
      {/* scale wrapper — shrinks on mobile so the disc fits */}
      <div className="origin-bottom scale-[0.4] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.7]">
      {/* character */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 268 }}
      >
        <PixelCharacter jumping={jumping} dark={dark} />
      </div>

      {/* floating music notes */}
      <MusicNotes />

      <div
        style={{
          width: 520,
          height: 520,
          transform: "translateY(50%)",
          perspective: 900,
        }}
      >
        {/* tilt */}
        <div
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transform: "rotateX(18deg)",
            filter: "drop-shadow(0 0 28px rgb(79 70 229 / 0.28))",
          }}
        >
          {/* step (track-based) */}
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `rotateZ(${stepAngle}deg)`,
              transition: "transform 700ms cubic-bezier(.22,1.2,.36,1)",
            }}
          >
            {/* spin (continuous) */}
            <div
              style={{
                width: "100%",
                height: "100%",
                animation: "spin-slow 20s linear infinite",
                transformOrigin: "50% 50%",
              }}
            >
              <Disc label={label} dark={dark} />
            </div>
          </div>
        </div>
      </div>
      </div> {/* end scale wrapper */}
    </div>
  );
}

// ── Floating music notes ────────────────────────────────────────────────────
const NOTES_CFG = [
  { char: "♪", x: -62, bottomOffset: 360, delay: 0.0,  duration: 2.6, size: 18 },
  { char: "♫", x:  52, bottomOffset: 350, delay: 0.9,  duration: 2.9, size: 22 },
  { char: "♬", x: -90, bottomOffset: 340, delay: 1.7,  duration: 2.4, size: 16 },
  { char: "♪", x:  80, bottomOffset: 370, delay: 0.4,  duration: 3.1, size: 14 },
  { char: "♫", x: -40, bottomOffset: 380, delay: 2.2,  duration: 2.7, size: 20 },
  { char: "♩", x:  30, bottomOffset: 345, delay: 1.3,  duration: 2.5, size: 15 },
  { char: "♬", x: 100, bottomOffset: 355, delay: 2.8,  duration: 2.8, size: 17 },
  { char: "♪", x: -110,bottomOffset: 365, delay: 0.6,  duration: 3.0, size: 19 },
] as const;

function MusicNotes() {
  return (
    <>
      {NOTES_CFG.map((n, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            bottom: n.bottomOffset,
            marginLeft: n.x,
            fontSize: n.size,
            color: "rgb(79 70 229)",        // indigo
            fontFamily: "serif",
            lineHeight: 1,
            textShadow: "0 0 8px rgb(79 70 229 / 0.7)",
            animation: `float-note ${n.duration}s ${n.delay}s ease-out infinite`,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {n.char}
        </div>
      ))}
    </>
  );
}

const SIZE = 520;
const CX = SIZE / 2;
const CY = SIZE / 2;
const CELL = 8;

type Tone = "ink" | "bone" | "indigo";
type Ring = { from: number; to: number; fill: Tone };

const RINGS: Ring[] = [
  { from: 240, to: 252, fill: "bone" },
  { from: 228, to: 240, fill: "ink" },
  { from: 222, to: 228, fill: "indigo" },
  { from: 210, to: 222, fill: "ink" },
  { from: 204, to: 210, fill: "indigo" },
  { from: 178, to: 204, fill: "ink" },
  { from: 172, to: 178, fill: "indigo" },
  { from: 160, to: 172, fill: "ink" },
  { from: 154, to: 160, fill: "bone" },
  { from: 110, to: 154, fill: "bone" }, // label area
  { from: 104, to: 110, fill: "ink" },
  { from: 60, to: 104, fill: "ink" },
  { from: 54, to: 60, fill: "bone" },
  { from: 18, to: 54, fill: "ink" },
  { from: 0, to: 18, fill: "indigo" },
];

function pickFill(d: number): Tone | null {
  if (d > 252) return null;
  for (const r of RINGS) if (d >= r.from && d < r.to) return r.fill;
  return "ink";
}

function colorFor(tone: Tone, dark: boolean) {
  if (tone === "indigo") return "#4F46E5";
  if (tone === "ink") return dark ? "#000000" : "#0C0C12"; // body ink reads as near-black
  // bone — reverses with theme
  return dark ? "#FFFFFF" : "#F5F4F0";
}

/**
 * In light mode we want the disc to still read as a disc, so the
 * "ink" tone stays dark and "bone" stays light, regardless of theme.
 * Theme only affects subtle accents (specular highlight).
 */
function Disc({ label, dark }: { label: string; dark: boolean }) {
  const cells = useMemo(() => {
    const out: JSX.Element[] = [];
    for (let y = 0; y < SIZE; y += CELL) {
      for (let x = 0; x < SIZE; x += CELL) {
        const dx = x + CELL / 2 - CX;
        const dy = y + CELL / 2 - CY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const tone = pickFill(d);
        if (!tone) continue;
        // disc keeps its own contrast — dark body / light label — both modes
        const color =
          tone === "indigo"
            ? "#4F46E5"
            : tone === "ink"
              ? "#0A0A14"
              : "#F1EFE7";
        out.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={CELL}
            height={CELL}
            fill={color}
          />,
        );
      }
    }
    return out;
  }, []);

  const grooves = useMemo(() => {
    const out: JSX.Element[] = [];
    for (const r of [196, 188]) {
      const steps = 56;
      for (let i = 0; i < steps; i++) {
        if (i % 2) continue;
        const a = (i / steps) * Math.PI * 2;
        const x = CX + Math.cos(a) * r - CELL / 2;
        const y = CY + Math.sin(a) * r - CELL / 2;
        out.push(
          <rect
            key={`g-${r}-${i}`}
            x={Math.round(x / CELL) * CELL}
            y={Math.round(y / CELL) * CELL}
            width={CELL}
            height={CELL}
            fill="#4F46E5"
          />,
        );
      }
    }
    return out;
  }, []);

  const labelR = 132;
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      shapeRendering="crispEdges"
      style={{ display: "block" }}
    >
      {cells}
      {grooves}

      <defs>
        <path
          id="cd-label-path"
          d={`M ${CX - labelR},${CY} a ${labelR},${labelR} 0 1,1 ${labelR * 2},0 a ${labelR},${labelR} 0 1,1 ${-labelR * 2},0`}
          fill="none"
        />
      </defs>
      <text
        fill="#0A0A14"
        fontFamily="var(--font-pixel), monospace"
        fontSize="22"
        letterSpacing="3"
      >
        <textPath href="#cd-label-path" startOffset="0">
          {`${label}   ★   ${label}   ★   `}
        </textPath>
      </text>

      {/* specular */}
      <rect x={CX + 60} y={CY - 60} width={CELL} height={CELL} fill="#F1EFE7" />
      <rect x={CX + 68} y={CY - 60} width={CELL} height={CELL} fill="#F1EFE7" />
      <rect x={CX + 60} y={CY - 52} width={CELL} height={CELL} fill="#F1EFE7" />
    </svg>
  );
}
