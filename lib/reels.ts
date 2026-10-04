// Resources behind each reel. When someone comments a keyword (like "tool")
// on a reel, send them /reels-resources - they find the reel by name and open
// it to see everything it mentions.
//
// To add a new reel: add one object to `reels` below. Newest-first ordering
// is automatic (by `date`), and `slug` gives it a shareable deep link, e.g.
// /reels-resources#veed-openedit opens that reel's dropdown directly - handy
// when replying to a specific comment.

export type ReelResource =
  | { kind: "link"; title: string; description?: string; href: string }
  | { kind: "command"; title: string; description?: string; command: string }
  | { kind: "note"; title: string; body: string };

export interface Reel {
  slug: string;
  title: string;
  /** ISO date the reel was published */
  date: string;
  /** one line on what the reel covers */
  summary: string;
  /** link to the reel itself, if you want a "watch the reel" button */
  reelUrl?: string;
  resources: ReelResource[];
}

export const reels: Reel[] = [
  {
    slug: "veed-openedit",
    title: "VEED OpenEdit",
    date: "2026-10-04",
    summary:
      "Edit video by describing it to a coding agent: trims, vertical reframing, word-timed captions and text overlays, rendered to MP4.",
    resources: [
      {
        kind: "link",
        title: "OpenEdit on GitHub",
        description: "The open-source repo from VEED. Start here.",
        href: "https://github.com/veedstudio/open-edit",
      },
      {
        kind: "link",
        title: "Setup guide",
        description: "Step-by-step install and first run.",
        href: "https://github.com/veedstudio/open-edit/blob/main/SETUP.md",
      },
      {
        kind: "link",
        title: "Command reference",
        description: "Every CLI command, in the README.",
        href: "https://github.com/veedstudio/open-edit/blob/main/README.md",
      },
      {
        kind: "note",
        title: "What you need first",
        body: "Node.js 20.18 or newer, FFmpeg, and a coding agent that can load the OpenEdit skill (Claude Code, Codex or Gemini).",
      },
      {
        kind: "command",
        title: "1. Add the skill to your agent",
        command: "npx skills add veedstudio/open-edit --skill open-edit",
      },
      {
        kind: "command",
        title: "2. Set up your workspace",
        description: "Run this in the folder where you want to make the video.",
        command: "npx --yes @veedstudio/openedit-cli init",
      },
      {
        kind: "command",
        title: "Captions: transcribe locally (free, private)",
        description:
          "WhisperX runs on your machine, so the video never leaves it. Use the medium model when captions matter.",
        command:
          "npx @veedstudio/openedit-cli transcribe video.mp4 --provider whisperx --model medium",
      },
      {
        kind: "note",
        title: "How to ask for an edit",
        body: "Give your agent the source file, exact start and end times, the aspect ratio (1080x1920 for vertical), where to crop from the 16:9 frame, the caption style, and any hook text. The more precise, the fewer retries.",
      },
      {
        kind: "note",
        title: "Good to know",
        body: "Always review the captions, since speech recognition mishears names and accents. Only edit footage you have the rights to use. Never paste API keys into a chat or a public repo.",
      },
      {
        kind: "link",
        title: "License",
        description:
          "Apache-2.0. The downloaded VEED renderer has its own terms, so read the NOTICE before commercial redistribution.",
        href: "https://github.com/veedstudio/open-edit/blob/main/LICENSE",
      },
      {
        kind: "link",
        title: "NOTICE (renderer licensing)",
        href: "https://github.com/veedstudio/open-edit/blob/main/NOTICE",
      },
    ],
  },
];

export function getReels(): Reel[] {
  return [...reels].sort((a, b) => b.date.localeCompare(a.date));
}
