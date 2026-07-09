import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const url = `https://dev-voyager.space/blog/${post.slug}`;

  return {
    title: `${post.title} — Akshay Kumar Sharma`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: ["Akshay Kumar Sharma"],
      tags: post.tags,
      images: [post.coverImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@cappybaradeploy",
      images: [post.coverImage],
    },
  };
}

const renderTextWithLinks = (text: string) => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [_, linkText, url] = match;
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    parts.push(
      <a
        key={matchIndex}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo hover:text-bone underline transition-colors"
      >
        {linkText}
      </a>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const url = `https://dev-voyager.space/blog/${post.slug}`;

  const jsonLd: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: post.tags.join(", "),
      author: {
        "@type": "Person",
        name: "Akshay Kumar Sharma",
        url: "https://dev-voyager.space",
        jobTitle: "Developer Relations & Engineer",
        homeLocation: {
          "@type": "Place",
          name: "Bangalore, India",
          geo: {
            "@type": "GeoCoordinates",
            latitude: 12.9716,
            longitude: 77.5946,
          },
        },
      },
      publisher: {
        "@type": "Person",
        name: "Akshay Kumar Sharma",
      },
      image: `https://dev-voyager.space${post.coverImage}`,
    },
  ];

  if (post.faqs && post.faqs.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <article>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 font-pixel text-xs tracking-[0.2em] text-indigo hover:text-bone"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> all articles
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-pixel text-[10px] tracking-[0.2em] text-indigo/70 sm:text-xs">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-bone sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-bone/70 sm:text-lg">
          {post.description}
        </p>
      </header>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.coverImage}
        alt={post.title}
        className="mt-8 w-full border-2 border-indigo/15 object-cover"
      />

      <div className="mt-10 space-y-10">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-pixel text-base tracking-[0.15em] text-indigo sm:text-lg">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-4">
              {section.blocks.map((block, i) =>
                block.type === "p" ? (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-bone/85 sm:text-base"
                  >
                    {renderTextWithLinks(block.text)}
                  </p>
                ) : (
                  <figure key={i} className="!mt-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.src}
                      alt={block.alt}
                      className="w-full border-2 border-indigo/15 object-cover"
                      loading="lazy"
                    />
                    {block.caption && (
                      <figcaption className="mt-2 text-center text-xs text-bone/50">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              )}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-16 border-t-2 border-indigo/10 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-pixel text-xs tracking-[0.2em] text-indigo hover:text-bone"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> back to all articles
        </Link>
      </footer>
    </article>
  );
}
