import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div>
      <h1 className="font-pixel text-3xl tracking-wider text-bone sm:text-5xl">
        blog
      </h1>
      <p className="mt-4 max-w-xl text-sm text-bone/70 sm:text-base">
        articles on ai, developer tooling, and the things I build and break
        while figuring them out.
      </p>

      <ul className="mt-12 divide-y-2 divide-indigo/10">
        {posts.map((post) => (
          <li key={post.slug} className="py-8 first:pt-0">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-5 sm:flex-row sm:items-start"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full shrink-0 border-2 border-indigo/15 object-cover sm:w-48"
              />
              <div>
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
                <h2 className="mt-2 text-lg font-semibold text-bone transition-colors group-hover:text-indigo sm:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone/70 sm:text-base">
                  {post.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 font-pixel text-xs text-indigo">
                  read article <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
