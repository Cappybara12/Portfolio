"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import PixelCD from "@/components/PixelCD";
import Starfield from "@/components/Starfield";
import Section from "@/components/Section";
import SocialIcons from "@/components/SocialIcons";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import YouTubeShortEmbed from "@/components/YouTubeShortEmbed";
import InstagramEmbed from "@/components/InstagramEmbed";
import LinkedInEmbed from "@/components/LinkedInEmbed";
import XEmbed from "@/components/XEmbed";
import ThemeToggle from "@/components/ThemeToggle";
import { TRACKS } from "@/lib/tracks";
import { ArrowUpRight, Mail, ChevronLeft, ChevronRight, Calendar, Users, Zap, Globe, Eye, FileText, Play, Trophy } from "lucide-react";

const VIDEOS = [
  { id: "SeZGYUo74QI", title: "OpenTelemetry Full Course" },
  { id: "h5qQ0isJqOM", title: "OTel Collector Too Complex? Try SigNoz Agents" },
  { id: "R5Lui7VK9Ys", title: "OpenTelemetry on Kubernetes" },
  { id: "5YMbyJ7X2ss", title: "OpenTelemetry Docker Setup" },
  { id: "FEDdaOVynbE", title: "OpenTelemetry VM Setup" },
  { id: "NxW0XhWhN-s", title: "AWS ECS OpenTelemetry Tutorial" },
];

const SHORTS = [
  "https://www.youtube.com/shorts/H2tksFe6_Y0",
  "https://www.youtube.com/shorts/zwDMfTS8aXk",
  "https://youtube.com/shorts/vKg1Hk2jiCU",
  "https://youtube.com/shorts/aiJ4osnDp8Q",
];

const REELS = [
  "https://www.instagram.com/p/DJWfjHUPaUZ/",
  "https://www.instagram.com/p/DPq11hzjCmH/",
  "https://www.instagram.com/p/DOGgdiQDHbK/",
  "https://www.instagram.com/p/DYhXDFxvXMN/",
];

const LINKEDIN_POSTS = [
  {
    url: "https://www.linkedin.com/posts/akshay-kumar-sharma-devvoyager_well-i-just-connected-my-companys-repository-ugcPost-7470120899074019329-MBXN/",
    caption: "connecting the company repo to ai",
  },
  {
    url: "https://www.linkedin.com/posts/akshay-kumar-sharma-devvoyager_last-weekend-i-used-ai-the-way-it-should-activity-7465401432368836608-jzP-/",
    caption: "weekend ai build",
  },
  {
    url: "https://www.linkedin.com/posts/akshay-kumar-sharma-devvoyager_the-ai-side-of-opentelemetry-is-something-activity-7462860485819023360-9lpC/",
    caption: "the ai side of opentelemetry",
  },
  {
    url: "https://www.linkedin.com/posts/akshay-kumar-sharma-devvoyager_buildinpublic-llm-ai-activity-7441771118388162560-wMqu/",
    caption: "#buildinpublic — llm + ai",
  },
];

const X_POSTS = [
  "https://x.com/cappybaradeploy/status/1998732463015891316",
];

const OLAKE = [
  { title: "IBM Db2 LUW to Lakehouse: sync to Apache Iceberg", href: "https://olake.io/blog/ibm-db2-luw-to-lakehouse-sync-apache-iceberg-olake" },
  { title: "Sync MSSQL to your lakehouse with OLake", href: "https://olake.io/blog/sync-mssql-to-your-lakehouse-with-olake" },
  { title: "MySQL to Apache Iceberg replication", href: "https://olake.io/blog/mysql-apache-iceberg-replication" },
  { title: "Ingesting files from S3 with OLake", href: "https://olake.io/blog/ingesting-files-from-s3-with-olake-turn-buckets-into-reliable-streams" },
  { title: "Postgres to Iceberg replication jobs — Docker CLI", href: "https://olake.io/blog/creating-job-olake-docker-cli" },
  { title: "Scalable lakehouse with Iceberg, Trino, OLake & Polaris", href: "https://olake.io/blog/apache-polaris-lakehouse" },
  { title: "Modern lakehouse with Iceberg, OLake, Lakekeeper & Trino", href: "https://olake.io/blog/building-modern-data-lakehouse-with-olake-iceberg-lakekeeper-trino" },
  { title: "Open data lakehouse with OLake, PrestoDB & MinIO", href: "https://olake.io/blog/building-open-data-lakehouse-with-olake-presto" },
  { title: "Delete methods in Iceberg & Delta Lake compared", href: "https://olake.io/blog/iceberg-delta-lake-delete-methods-comparison" },
];

const MEDIUM = [
  { title: "Breaking free from OpenAI API lock-in", href: "https://medium.com/openxai/the-developers-guide-to-breaking-free-from-openai-api-lock-in-4f39c618acfb" },
  { title: "Real-time in-car SOS detection with Qdrant Edge + SigNoz", href: "https://medium.com/towards-artificial-intelligence/how-i-built-a-real-time-in-car-sos-detection-system-with-qdrant-edge-signoz-and-yamnet-4cf3bd6365a7" },
  { title: "Why AI agents are exciting, but still hard to trust", href: "https://medium.com/@akshayne912/why-ai-agents-are-exciting-but-still-hard-to-trust-9931c69a8c70" },
  { title: "Building a fully local AI dictation model for free", href: "https://medium.com/@akshayne912/building-a-fully-local-ai-dictation-model-for-free-why-you-still-need-cloud-grade-observability-a31e14de1674" },
];

const ICEBERG_EVENTS = [
  {
    title: "apache iceberg meetup — bangalore",
    body: "india's first official apache iceberg meetup. co-hosted with aws, minio, puppygraph, olake, e6data, firebolt, fivetran.",
    href: "https://luma.com/c6tiloed",
  },
  {
    title: "apache iceberg bangalore: next-gen cdc patterns",
    body: "deep dive into change-data-capture patterns for the iceberg ecosystem.",
    href: "https://luma.com/8af1z837",
  },
  {
    title: "open lakehouse meetup ft. apache iceberg",
    body: "building scalable data platforms — hosted at cloudera office, bangalore.",
    href: "https://luma.com/uy0xp2mq",
  },
  {
    title: "olake 6th community meetup",
    body: "open-source lakehouse community workshop with industry speakers.",
    href: "https://luma.com/s2tr10oz",
  },
];

const GEEKROOM_EVENTS = [
  {
    title: "code kshetra",
    body: "india's largest student hackathon — 400+ participants, 17k+ registrations. partnered with microsoft, mastercard, vapi, groq. geekroom flagship event.",
    href: "https://geekroom.in",
  },
  {
    title: "hackblr 2026 — bangalore",
    body: "national-level ai hackathon co-hosted by geekroom in bangalore. two-round format: online qualifier → offline finale. focus on ai agents, voice ai, and llm applications.",
    href: "https://luma.com/ia0ik7c6",
  },
  {
    title: "code cubicle series",
    body: "5+ editions of geekroom's flagship online hackathon. partners across editions: microsoft, mastercard, vapi, groq. thousands of student participants from across india.",
    href: "https://code-cubicle.devfolio.co/",
  },
  {
    title: "code cubicle 5.0",
    body: "latest edition of the code cubicle series. open to developers across india with industry partner integrations and real-world problem statements.",
    href: "https://unstop.com/hackathons/code-cubicle-5-geek-room-1537583",
  },
  {
    title: "pears global hackathon by geekroom",
    body: "global online hackathon with pears technology. open to students, professionals, and coding enthusiasts. prize pool: tablets, airpods, headphones, and $5,000 cash.",
    href: "https://luma.com/9mqll98a",
  },
];

const WORK = [
  {
    org: "signoz",
    role: "developer relations engineer",
    when: "mar 2026 — present",
    paras: [
      "joined to advise on youtube as a developer education channel. built the content engine from the ground up: scripting, recording, and editing 10+ long-form and short-form videos on opentelemetry concepts — collection agents, ai observability, mcp integrations, llm monitoring.",
      "distribution stretches across channels: reddit posts with contextual summaries for devs evaluating observability tools, backlinks embedded into signoz docs to shorten time-to-value, cross-publishing across personal and brand profiles for organic reach beyond the official channel.",
    ],
  },
  {
    org: "datazip / olake",
    role: "developer relations engineer",
    when: "jul 2025 — feb 2026",
    paras: [
      "owned developer content and community for olake, the open-source data lakehouse. authored 9 deep technical blogs accumulating 150k+ impressions covering iceberg deletion strategies, mysql/postgres/mssql/db2 sync pipelines, and end-to-end lakehouse architecture with trino, polaris, lakekeeper, prestodb.",
      "conducted india's first official apache iceberg meetup in bangalore — co-hosted with aws, minio, puppygraph, e6data, firebolt, fivetran. organised multiple olake community meetups + workshops. coordinated hacktoberfest and gsoc programs. ran seo strategy that lifted site performance by 30%.",
    ],
  },
  {
    org: "tensorstax",
    role: "software engineer",
    when: "oct 2024",
    paras: [
      "joined an early-stage ai data platform building codex, an ai-driven etl tool. took full-stack ownership: efficient payload generation, apache superset dashboards reaching 80%+ chart accuracy in ai-driven analytics, automated the ml deployment pipeline on azure for seamless infra rollout and scaling.",
      "the work spanned product engineering, infrastructure, and data quality. platform later acquired by snowflake.",
    ],
  },
  {
    org: "geekroom",
    role: "founding member & community lead",
    when: "apr 2022 — present",
    paras: [
      "founded and scaled a pan-india developer community to 70k+ members across 20+ college chapters through hackathons, workshops, and technical sessions.",
      "led code kshetra — india's largest student hackathon (400+ participants, 17k+ registrations) — and the code cubicle series, partnering with microsoft, mastercard, vapi, groq to connect students with real-world engineering opportunities.",
    ],
  },
];

const TOTAL = TRACKS.length;
const COOLDOWN_MS = 750;

export default function Page() {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(true);
  const [eventsTab, setEventsTab] = useState<"iceberg" | "geekroom">("iceberg");
  const cooldownRef = useRef(false);
  const wheelAccRef = useRef(0);

  const go = useCallback((dir: number) => {
    if (cooldownRef.current) return;
    setActive((a) => {
      const next = Math.max(0, Math.min(TOTAL - 1, a + dir));
      if (next === a) return a;
      cooldownRef.current = true;
      setTimeout(() => (cooldownRef.current = false), COOLDOWN_MS);
      return next;
    });
  }, []);

  const goTo = useCallback((idx: number) => {
    setActive((a) => {
      if (idx === a) return a;
      cooldownRef.current = true;
      setTimeout(() => (cooldownRef.current = false), COOLDOWN_MS);
      return Math.max(0, Math.min(TOTAL - 1, idx));
    });
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // If the wheel target is INSIDE a section's scroll-area, the wheel only
      // ever scrolls that area — never switches tracks, even at the edges.
      // To advance to the next track, the user must move the cursor outside
      // the section (top hud, area near the CD, page margins, etc.).
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        if (el.dataset && el.dataset.scrollArea === "1") {
          wheelAccRef.current = 0;
          return;
        }
        el = el.parentElement;
      }
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      wheelAccRef.current += delta;
      if (Math.abs(wheelAccRef.current) > 40) {
        go(wheelAccRef.current > 0 ? 1 : -1);
        wheelAccRef.current = 0;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(1);
      }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(TOTAL - 1);
    };
    let tx = 0, ty = 0;
    const onTouchStart = (e: TouchEvent) => {
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (window.innerWidth < 768) return; // Disable mobile view swipe navigation
      const dx = e.changedTouches[0].clientX - tx;
      const dy = e.changedTouches[0].clientY - ty;
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(d) < 50) return;
      go(d < 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [go, goTo]);

  useEffect(() => {
    const cls = dark ? "theme-dark" : "theme-light";
    const other = dark ? "theme-light" : "theme-dark";
    document.documentElement.classList.add(cls);
    document.documentElement.classList.remove(other);
  }, [dark]);

  const trackId = TRACKS[active].id;
  const totalStr = TRACKS[TRACKS.length - 1].id; // last track id = "10"

  return (
    <main className="scanlines vignette relative h-screen overflow-hidden">
      <Starfield dark={dark} />

      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="font-pixel text-xs tracking-[0.2em] text-indigo sm:text-base sm:tracking-[0.3em]">
          akshay.sharma <span className="text-bone/40 hidden sm:inline">// portfolio</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://drive.google.com/file/d/1zpcK888lMS1cNvn1ROUNjKG85WbK3uyn/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-xs tracking-[0.2em] text-indigo hover:text-bone sm:text-sm sm:tracking-[0.25em] mr-2"
          >
            [ resume ]
          </a>
          <div className="hidden font-pixel text-base tracking-[0.3em] text-bone/70 md:block">
            <span className="text-indigo">{trackId}</span>
            <span className="text-bone/40"> / {totalStr}</span>
          </div>
          <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
        </div>
      </header>

      <div className="fixed left-6 top-16 z-30 hidden font-pixel text-sm tracking-[0.25em] text-bone/60 md:left-12 md:block">
        <span className="text-indigo">▸ now playing</span>{" "}
        {TRACKS[active].label.split(" — ")[1] ?? TRACKS[active].label}
      </div>

      {/* scroll-mode hint — top-right */}
      <div className="fixed right-6 top-16 z-30 hidden text-right font-pixel text-xs leading-loose tracking-[0.12em] md:right-12 md:block">
        <div className="font-bold text-bone/70">hover section → scroll content</div>
        <div className="glow-indigo font-bold text-indigo">move cursor out → change track</div>
      </div>

      {/* scroll nudge — fixed bottom-right of viewport */}
      <div className="fixed bottom-5 right-6 z-30 hidden text-right font-pixel text-[11px] leading-relaxed tracking-[0.15em] md:right-10 md:block">
        <span className="text-bone/60">hover on section </span>
        <span className="glow-indigo font-bold text-indigo">&amp; scroll</span>
        <span className="text-bone/60"> to see more</span>
      </div>

      {/* Mobile scroll nudge — fixed bottom-right of viewport, hidden on md+ */}
      <div className="fixed bottom-5 right-4 z-30 text-right font-pixel text-[10px] leading-tight tracking-[0.1em] md:hidden max-w-[120px] animate-mobile-nudge">
        <span className="text-bone/60">scroll the section you want to know more about. </span>
        <span className="glow-indigo font-bold text-indigo"><br /> </span>
        <span className="text-bone/60"><br />Use<br />arrows to<br />switch tracks</span>
      </div>

      {/* horizontal track */}
      <div
        className="flex h-full"
        style={{
          width: `${TOTAL * 100}vw`,
          transform: `translateX(-${active * 100}vw)`,
          transition: "transform 700ms cubic-bezier(.22,1.2,.36,1)",
        }}
      >
        {/* 00 INTRO */}
        <Section id="intro" index={0} active={active}>
          <div className="max-w-4xl pt-4">
            <p className="mb-6 font-pixel text-xl tracking-[0.3em] text-indigo">
              side a · now spinning
            </p>
            <h1 className="font-pixel text-4xl leading-[0.95] tracking-wider sm:text-6xl md:text-8xl">
              <span className="glow-indigo">akshay kumar</span>
              <br />
              <span className="caret">sharma</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone/80 sm:mt-10 sm:text-xl md:text-2xl">
              developer relations engineer who builds communities and ships content.
            </p>
            <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
              <SocialIcons />
              <div className="flex flex-col gap-2">
                <div className="font-pixel text-xs tracking-[0.25em] text-bone/40 sm:text-sm">
                  → scroll · arrow keys · or swipe
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 01 COMMUNITY */}
        <Section id="community" index={1} active={active} title="community" kicker="70k humans">
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatedStat rawValue={70000} fmt={(n) => (n >= 1000 ? Math.floor(n / 1000) + "K+" : n + "+")} label="geekroom members" icon={Users} bars={14} active={active === 1} delay={0} />
            <AnimatedStat rawValue={20} fmt={(n) => n + "+"} label="college chapters" icon={Globe} bars={8} active={active === 1} delay={150} />
            <AnimatedStat rawValue={17000} fmt={(n) => (n >= 1000 ? Math.floor(n / 1000) + "K+" : n + "+")} label="hackathon registrations — code kshetra" icon={Zap} bars={12} active={active === 1} delay={300} />
            <AnimatedStat rawValue={4} fmt={(n) => String(n)} label="partners: microsoft · mastercard · vapi · groq" icon={Trophy} bars={4} active={active === 1} delay={450} />
          </div>
        </Section>

        {/* 02 CONTENT */}
        <Section id="content" index={2} active={active} title="content" kicker="reach">
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatedStat rawValue={500000} fmt={(n) => (n >= 1000 ? Math.floor(n / 1000) + "K+" : n + "+")} label="linkedin impressions" icon={Users} bars={16} active={active === 2} delay={0} />
            <AnimatedStat rawValue={150000} fmt={(n) => (n >= 1000 ? Math.floor(n / 1000) + "K+" : n + "+")} label="olake blog impressions" icon={Eye} bars={12} active={active === 2} delay={150} />
            <AnimatedStat rawValue={30} fmt={(n) => n + "+"} label="medium articles · 9 olake articles" icon={FileText} bars={6} active={active === 2} delay={300} />
            <AnimatedStat rawValue={10} fmt={(n) => n + "+"} label="long-form videos · many shorts" icon={Play} bars={4} active={active === 2} delay={450} />
          </div>
          <p className="mt-6 max-w-3xl text-bone/80">
            creating long-form tutorials and short-form explainers, distributed across
            olake youtube, signoz youtube, personal linkedin, instagram, and x.
          </p>
        </Section>

        {/* 03 VIDEOS */}
        <Section id="videos" index={3} active={active} title="long-form videos" kicker="signoz · olake · youtube">
          {/* SigNoz videos */}
          <h3 className="mb-3 font-pixel text-sm tracking-[0.3em] text-indigo">signoz youtube</h3>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((v) => (
              <YouTubeEmbed key={v.id} id={v.id} title={v.title} />
            ))}
          </div>
          <div className="mt-6">
            <h3 className="mb-3 font-pixel text-sm tracking-[0.3em] text-indigo">
              podcast — observability &amp; devtools
            </h3>
            <div className="max-w-xl">
              <YouTubeEmbed id="XOVkaY5MmiQ" title="cto podcast — observability & developer tooling" />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-6">
            <a
              href="https://www.youtube.com/@signoz/videos"
              target="_blank"
              rel="noreferrer"
              className="pixel-underline inline-flex items-center gap-2 font-pixel text-base text-bone"
            >
              more on signoz youtube <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://www.youtube.com/@olakeio"
              target="_blank"
              rel="noreferrer"
              className="pixel-underline inline-flex items-center gap-2 font-pixel text-base text-bone"
            >
              more on olake youtube <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Section>

        {/* 03.1 SHORTS + REELS */}
        <Section id="shorts" index={4} active={active} title="short-form" kicker="shorts · reels">
          <p className="mb-6 max-w-3xl text-bone/80">
            short-form explainers running across youtube shorts and instagram reels.
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-pixel text-lg tracking-widest text-indigo">youtube shorts</h3>
              <div className="grid grid-cols-2 gap-3">
                {SHORTS.map((u) => (
                  <YouTubeShortEmbed key={u} url={u} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h3 className="font-pixel text-lg tracking-widest text-indigo">instagram reels</h3>
                <span className="font-pixel text-sm tracking-widest text-bone/70">
                  <span className="text-indigo">@akshayat.it</span> · 1,200+ followers
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {REELS.map((u) => (
                  <InstagramEmbed key={u} url={u} />
                ))}
              </div>
              <a
                href="https://instagram.com/akshayat.it"
                target="_blank"
                rel="noreferrer"
                className="pixel-underline mt-4 inline-flex items-center gap-2 font-pixel text-base text-bone"
              >
                @akshayat.it on instagram <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Section>

        {/* 03.2 LINKEDIN */}
        <Section id="linkedin" index={5} active={active} title="linkedin featured" kicker="500k+ impressions">
          <p className="mb-6 max-w-3xl text-bone/80">
            dedicated technical posts that drove 500k+ impressions and built a consistent audience over time.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {LINKEDIN_POSTS.map((p) => (
              <LinkedInEmbed key={p.url} url={p.url} caption={p.caption} />
            ))}
          </div>
          <a
            href="https://www.linkedin.com/in/akshay-kumar-sharma-37aa55256/"
            target="_blank"
            rel="noreferrer"
            className="pixel-underline mt-6 inline-flex items-center gap-2 font-pixel text-lg text-bone"
          >
            more on linkedin <ArrowUpRight className="h-4 w-4" />
          </a>
        </Section>

        {/* 03.3 X */}
        <Section id="x" index={6} active={active} title="x posts" kicker="cappybaradeploy">
          <div className="grid gap-5 md:grid-cols-2">
            {X_POSTS.map((u) => (
              <XEmbed key={u} url={u} />
            ))}
          </div>
          <a
            href="https://x.com/cappybaradeploy"
            target="_blank"
            rel="noreferrer"
            className="pixel-underline mt-6 inline-flex items-center gap-2 font-pixel text-lg text-bone"
          >
            @cappybaradeploy on x <ArrowUpRight className="h-4 w-4" />
          </a>
        </Section>

        {/* 04 WRITING */}
        <Section id="writing" index={7} active={active} title="writing" kicker="long form">
          <div className="pixel-frame mb-6 p-4">
            <p className="font-pixel text-xl text-bone">
              <span className="text-indigo">9 olake articles</span>
              <span className="text-bone/40"> · </span>
              <span className="text-indigo">30+ medium articles</span>
              <span className="text-bone/40"> · </span>
              <span className="text-indigo">150k+</span> cumulative impressions
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <ColumnList
              heading="olake — 9 articles · 150k+ impressions"
              items={OLAKE}
              allHref="https://olake.io/blog/authors/akshay/"
              allLabel="view all 9 olake articles"
            />
            <ColumnList
              heading="medium — 30+ articles · selected"
              items={MEDIUM}
              allHref="https://medium.com/@akshayne912"
              allLabel="view all 30+ medium articles"
            />
          </div>
        </Section>

        {/* 05 EVENTS */}
        <Section id="events" index={8} active={active} title="events & workshops" kicker="iceberg · olake · geekroom">

          {/* ── Tab switcher ─────────────────────────────────────── */}
          <div className="mb-6 flex gap-0 shrink-0">
            <button
              onClick={() => setEventsTab("iceberg")}
              className={`flex items-center gap-2 border-2 px-4 py-2 font-pixel text-xs tracking-widest transition-colors ${eventsTab === "iceberg"
                ? "border-indigo bg-indigo text-ink"
                : "border-indigo/40 bg-transparent text-bone/50 hover:border-indigo hover:text-bone"
                }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              iceberg &amp; olake
            </button>
            <button
              onClick={() => setEventsTab("geekroom")}
              className={`flex items-center gap-2 border-2 border-l-0 px-4 py-2 font-pixel text-xs tracking-widest transition-colors ${eventsTab === "geekroom"
                ? "border-indigo bg-indigo text-ink"
                : "border-indigo/40 bg-transparent text-bone/50 hover:border-indigo hover:text-bone"
                }`}
            >
              <Users className="h-3.5 w-3.5" />
              geekroom
            </button>
          </div>

          {/* ── Apache Iceberg / OLake tab ───────────────────────── */}
          {eventsTab === "iceberg" && (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                {ICEBERG_EVENTS.map((e) => (
                  <a
                    key={e.href}
                    href={e.href}
                    target="_blank"
                    rel="noreferrer"
                    className="pixel-frame block p-5 transition-colors hover:bg-indigo/5"
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-1 h-4 w-4 shrink-0 text-indigo" />
                      <div>
                        <h4 className="font-pixel text-base text-bone glow-indigo">{e.title}</h4>
                        <p className="mt-1.5 text-sm text-bone/75">{e.body}</p>
                        <span className="pixel-underline mt-2 inline-flex items-center gap-1.5 font-pixel text-xs text-indigo">
                          view event <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-5">
                <a href="https://luma.com/olake?period=past" target="_blank" rel="noreferrer"
                  className="pixel-underline inline-flex items-center gap-2 font-pixel text-sm text-bone">
                  all olake past events <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a href="https://www.meetup.com/bengaluru-apache-iceberg-meetups/" target="_blank" rel="noreferrer"
                  className="pixel-underline inline-flex items-center gap-2 font-pixel text-sm text-bone">
                  bangalore apache iceberg group <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </>
          )}

          {/* ── Geek Room tab ────────────────────────────────────── */}
          {eventsTab === "geekroom" && (
            <>
              {/* Geek Room identity banner */}
              <div className="pixel-frame mb-5 flex flex-wrap items-center gap-4 bg-indigo/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-indigo bg-indigo">
                    <Users className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <div className="font-pixel text-lg text-bone glow-indigo">geekroom</div>
                    <div className="font-pixel text-[10px] tracking-[0.2em] text-indigo">community hackathons &amp; events</div>
                  </div>
                </div>
                <div className="ml-auto flex flex-wrap gap-4">
                  {[["70k+", "members"], ["20+", "chapters"], ["5+", "hackathons"]].map(([n, l]) => (
                    <div key={l} className="text-center">
                      <div className="font-pixel text-lg text-bone glow-indigo">{n}</div>
                      <div className="font-pixel text-[9px] tracking-widest text-indigo">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {GEEKROOM_EVENTS.map((e) => (
                  <a
                    key={e.href}
                    href={e.href}
                    target="_blank"
                    rel="noreferrer"
                    className="pixel-frame block p-5 transition-colors hover:bg-indigo/5"
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-1 h-4 w-4 shrink-0 text-indigo" />
                      <div>
                        <h4 className="font-pixel text-base text-bone glow-indigo">{e.title}</h4>
                        <p className="mt-1.5 text-sm text-bone/75">{e.body}</p>
                        <span className="pixel-underline mt-2 inline-flex items-center gap-1.5 font-pixel text-xs text-indigo">
                          view event <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <a href="https://luma.com/user/geekroom1" target="_blank" rel="noreferrer"
                className="pixel-underline mt-5 inline-flex items-center gap-2 font-pixel text-sm text-bone">
                all geekroom events on luma <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </>
          )}
        </Section>

        {/* 06 WORK */}
        <Section id="work" index={9} active={active} title="work" kicker="experience">
          <div className="grid gap-5 md:grid-cols-2">
            {WORK.map((w) => (
              <article key={w.org} className="pixel-frame p-4 sm:p-6 transition-colors hover:bg-indigo/5">
                <div className="flex items-baseline justify-between gap-3 sm:gap-4">
                  <h3 className="font-pixel text-xl sm:text-2xl text-bone glow-indigo">{w.org}</h3>
                  <span className="font-pixel text-[10px] sm:text-xs tracking-widest text-indigo">{w.when}</span>
                </div>
                <p className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-bone/60">{w.role}</p>
                {w.paras.map((p, i) => (
                  <p key={i} className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-bone/85">{p}</p>
                ))}
              </article>
            ))}
          </div>
          {/* Resume link removed as it is now in the top-right header */}
        </Section>

        {/* 07 PROJECTS */}
        <Section id="projects" index={10} active={active} title="projects" kicker="ships">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              name="nonilion"
              href="https://nonilion.com"
              stack="next.js · livekit · gcp · docker"
              body="immersive virtual meeting platform. 3k+ users. #5 product of the day on product hunt. sub-meeting spaces with 3d avatars, spatial audio using livekit for real-time webrtc, jira sdk integration for in-meeting task management."
            />
            <ProjectCard
              name="balencai"
              stack="langchain · mastra · rag · openai"
              body="finance document automation via ai agents. mastra agentic workflows for extracting financial fields from pdfs; rag pipeline with vector embeddings for natural language querying."
            />
            <ProjectCard
              name="granite pill"
              href="https://github.com/Cappybara12/wispr-parody"
              stack="electron · python · ibm granite · local asr"
              body="floating always-on-top speech-to-text desktop app for apple silicon macs. transcribes audio entirely on-device with ibm's granite 4.0 — no cloud. shift+x hotkey, instant clipboard copy."
            />
          </div>
          <a
            href="https://github.com/akshayne912"
            target="_blank"
            rel="noreferrer"
            className="pixel-underline mt-8 inline-flex items-center gap-2 font-pixel text-base text-bone"
          >
            check more projects on github <ArrowUpRight className="h-4 w-4" />
          </a>
        </Section>

        {/* 08 DISTRIBUTION */}
        <Section id="distribution" index={11} active={active} title="distribution" kicker="channels">
          <div className="grid gap-4 md:grid-cols-3">
            <DistTile head="reddit" body="contextual video summaries targeting devs evaluating observability tools." href="https://www.reddit.com/user/cappybaradeploy" />
            <DistTile head="hacker news" body="strategic technical post submissions." href="https://news.ycombinator.com/user?id=cappybaradeploy" />
            <DistTile head="linkedin" body="5k+ followers · 500k+ impressions sharing projects organically." href="https://www.linkedin.com/in/akshay-kumar-sharma-37aa55256/" />
            <DistTile head="x" body="@cappybaradeploy — technical posts and ai/observability commentary." href="https://x.com/cappybaradeploy" />
            <DistTile head="instagram" body="@akshayat.it — reels covering ai, devtools, and behind-the-scenes." href="https://instagram.com/akshayat.it" />
          </div>
        </Section>

        {/* 09 REVIEWS */}
        <Section id="reviews" index={12} active={active} title="what managers say" kicker="receipts">
          <div className="grid gap-6 md:grid-cols-2">
            <Quote
              body="worked with akshay for a short duration at signoz, and what stood out to me was his exceptional agency. he would always come up with creative, new content ideas and deliver promptly."
              by="manager — signoz"
            />
            <Quote
              body="akshay has an exceptional ability to solve complex issues, even when documentation is lacking, highlighting his deep technical expertise and problem-solving skills."
              by="saurabh shubham — founder @ mindcase"
            />
            <Quote
              body="i strongly endorse akshay kumar sharma for his exceptional project coordination skills, especially within the tech domain. he is adept at leading teams and managing projects with efficiency. he consistently demonstrates a proactive approach, delivering tasks ahead of schedule. his talent for delegating tasks effectively greatly contributes to the team's success."
              by="sanskriti kadam — mentor · power bi developer @ prophecy"
            />
            <Quote
              body="i highly recommend akshay, especially for team management. he's great with tech and leading teams. he's shown he can handle projects well and works great with others. he's got lots of skills and is always eager to help out."
              by="yatharth chauhan — managed directly · building @yatri cloud · aws community builder"
            />
          </div>
        </Section>

        {/* 10 CONTACT */}
        <Section id="contact" index={13} active={active} title="let's talk" kicker="end side a">
          <p className="max-w-2xl text-xl text-bone/85 md:text-2xl">
            currently open to devrel roles at ai and developer tooling companies.
          </p>
          <a
            href="mailto:akshayne912@gmail.com"
            className="pixel-frame mt-10 inline-flex items-center gap-3 bg-indigo px-6 py-4 font-pixel text-2xl text-bone transition-colors hover:bg-bone hover:text-indigo"
          >
            <Mail className="h-5 w-5" /> akshayne912@gmail.com
          </a>
          <div className="mt-10">
            <SocialIcons />
          </div>
          <p className="mt-12 font-pixel text-sm tracking-[0.3em] text-bone/40">
            ★ flip the disc for side b ★
          </p>
        </Section>
      </div>

      <PixelCD label={TRACKS[active].label} activeTrack={active} dark={dark} />

      {/* Top track navigator */}
      <nav className="fixed left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-3 border-2 border-indigo bg-ink/70 px-3 py-2 backdrop-blur">
        <button
          aria-label="previous track"
          onClick={() => go(-1)}
          disabled={active === 0}
          className="text-indigo transition-opacity hover:opacity-70 disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {/* Dots — visible md+ only */}
        <ul className="hidden items-center gap-1.5 md:flex">
          {TRACKS.map((t, i) => (
            <li key={t.id}>
              <button
                aria-label={`go to ${t.label}`}
                onClick={() => goTo(i)}
                className="block h-2 w-2 border border-indigo transition-colors"
                style={{
                  background: i === active ? "rgb(79 70 229)" : "transparent",
                }}
              />
            </li>
          ))}
        </ul>
        {/* Track counter — mobile only */}
        <span className="font-pixel text-xs tracking-widest text-indigo md:hidden">
          {trackId}<span className="text-bone/40">/{totalStr}</span>
        </span>
        <button
          aria-label="next track"
          onClick={() => go(1)}
          disabled={active === TOTAL - 1}
          className="text-indigo transition-opacity hover:opacity-70 disabled:opacity-25"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>

      {/* Mobile side-arrow navigation — hidden on md+ */}
      <button
        aria-label="previous track"
        onClick={() => go(-1)}
        disabled={active === 0}
        className="fixed left-2 top-[70%] z-30 -translate-y-1/2 border-2 border-indigo bg-ink/80 p-2.5 text-indigo backdrop-blur transition-opacity hover:opacity-70 disabled:opacity-20 md:hidden"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="next track"
        onClick={() => go(1)}
        disabled={active === TOTAL - 1}
        className="fixed right-2 top-[70%] z-30 -translate-y-1/2 border-2 border-indigo bg-ink/80 p-2.5 text-indigo backdrop-blur transition-opacity hover:opacity-70 disabled:opacity-20 md:hidden"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </main>
  );
}

// ── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);
  return value;
}

// ── Pixel progress bar ─────────────────────────────────────────────────────
function PixelBar({ filled, total = 16, baseDelay = 0 }: { filled: number; total?: number; baseDelay?: number }) {
  return (
    <div className="mt-2.5 sm:mt-3 flex gap-[2px] sm:gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 sm:w-2 sm:h-2"
          style={{
            background: i < filled ? "rgb(79 70 229)" : "rgb(79 70 229 / 0.12)",
            transition: `background 180ms ${baseDelay + i * 35}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ── Animated stat card ─────────────────────────────────────────────────────
function AnimatedStat({
  rawValue,
  fmt,
  label,
  icon: Icon,
  bars,
  active,
  delay = 0,
}: {
  rawValue: number;
  fmt: (n: number) => string;
  label: string;
  icon: React.ElementType;
  bars: number;
  active: boolean;
  delay?: number;
}) {
  const count = useCountUp(rawValue, active, 1400);
  return (
    <div
      className="pixel-frame p-4 sm:p-6 transition-colors hover:bg-indigo/5"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 400ms ${delay}ms, transform 400ms ${delay}ms, background-color 280ms`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="font-pixel text-3xl sm:text-5xl leading-none text-bone glow-indigo md:text-6xl">
          {fmt(count)}
        </div>
        <Icon className="mt-1 h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-indigo" />
      </div>
      <PixelBar filled={active ? bars : 0} baseDelay={delay} />
      <div className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-bone/70">{label}</div>
    </div>
  );
}

function ColumnList({
  heading,
  items,
  allHref,
  allLabel,
}: {
  heading: string;
  items: { title: string; href: string }[];
  allHref: string;
  allLabel: string;
}) {
  return (
    <div>
      <h3 className="mb-2 sm:mb-3 font-pixel text-sm sm:text-base tracking-widest text-indigo">{heading}</h3>
      <ul className="space-y-1.5 sm:space-y-2 border-l-2 border-indigo/40 pl-3 sm:pl-4">
        {items.map((i) => (
          <li key={i.href}>
            <a
              href={i.href}
              target="_blank"
              rel="noreferrer"
              className="pixel-underline inline-flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-bone/90"
            >
              <span className="text-indigo">›</span>
              <span>{i.title}</span>
              <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
      <a
        href={allHref}
        target="_blank"
        rel="noreferrer"
        className="pixel-underline mt-3 sm:mt-4 inline-flex items-center gap-2 font-pixel text-sm sm:text-base text-bone"
      >
        {allLabel} <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function ProjectCard({
  name,
  href,
  stack,
  body,
}: {
  name: string;
  href?: string;
  stack: string;
  body: string;
}) {
  const content = (
    <div className="pixel-frame h-full p-4 sm:p-7 transition-colors hover:bg-indigo/5">
      <h3 className="font-pixel text-2xl sm:text-4xl text-bone glow-indigo">{name}</h3>
      <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-indigo">{stack}</p>
      <p className="mt-3 sm:mt-5 text-sm sm:text-base text-bone/85">{body}</p>
      {href && (
        <span className="pixel-underline mt-4 sm:mt-6 inline-flex items-center gap-1.5 sm:gap-2 font-pixel text-sm sm:text-lg text-bone">
          visit <ArrowUpRight className="h-4 w-4" />
        </span>
      )}
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}

function DistTile({ head, body, href }: { head: string; body: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="pixel-frame block p-4 sm:p-6 transition-colors hover:bg-indigo/5"
    >
      <h3 className="font-pixel text-xl sm:text-2xl text-bone glow-indigo">{head}</h3>
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-bone/85">{body}</p>
      <span className="pixel-underline mt-2 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 font-pixel text-xs sm:text-sm text-indigo">
        open <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

function Quote({ body, by }: { body: string; by: string }) {
  return (
    <figure className="pixel-frame p-4 sm:p-7">
      <div className="mb-1.5 sm:mb-3 font-pixel text-2xl sm:text-3xl text-indigo">"</div>
      <blockquote className="text-sm sm:text-lg leading-relaxed text-bone/90">{body}</blockquote>
      <figcaption className="mt-3 sm:mt-4 font-pixel text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] text-indigo">— {by}</figcaption>
    </figure>
  );
}
