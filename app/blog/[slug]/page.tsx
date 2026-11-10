import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, formatPostDate } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((item) => item.slug === slug);
  return { title: post?.title ?? "Nota", description: post?.excerpt };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = POSTS.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-8">
      <Link href="/blog" className="text-[0.68rem] uppercase tracking-[0.16em] text-gold">
        Cuaderno
      </Link>
      <p className="mt-6 text-[0.68rem] uppercase tracking-[0.16em] text-mute">
        {formatPostDate(post.date)} · {post.author}
      </p>
      <h1 className="mt-3 font-display text-5xl leading-tight md:text-6xl">{post.title}</h1>
      <div className="relative mt-8 aspect-[16/9]">
        <Image src={post.image} alt="" fill className="object-cover" priority />
      </div>
      <div className="mt-8 space-y-5 text-base leading-8 text-ivory/80">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
