import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { POSTS, formatPostDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notas del atelier LuxTime.",
};

export default function BlogPage() {
  return (
    <div className="shell">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Cuaderno</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">Notas del taller</h1>
      <ul className="mt-10 divide-y divide-line/20 border-y border-line/20">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="grid items-center gap-6 py-8 md:grid-cols-[16rem_1fr]"
            >
              <div className="relative aspect-[16/10]">
                <Image src={post.image} alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-mute">
                  {formatPostDate(post.date)} · {post.author}
                </p>
                <h2 className="mt-2 font-display text-4xl">{post.title}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-ink/75">{post.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
