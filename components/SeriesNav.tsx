import Link from 'next/link'
import type { PostMeta } from '@/lib/content'

type Props = {
  currentSlug: string
  seriesName: string
  posts: PostMeta[]
}

export default function SeriesNav({ currentSlug, seriesName, posts }: Props) {
  return (
    <div className="rounded-xl border border-mint-400/20 bg-mint-400/5 p-4 mb-8">
      <p className="text-xs text-mint-400 font-semibold uppercase tracking-wider mb-3">
        시리즈 — {seriesName}
      </p>
      <ol className="space-y-2">
        {posts.map((p, i) => (
          <li key={p.slug} className="flex items-baseline gap-2 text-sm">
            <span className="text-xs text-slate-600 flex-shrink-0 w-4">{i + 1}.</span>
            {p.slug === currentSlug ? (
              <span className="text-slate-200 font-medium">{p.title}</span>
            ) : (
              <Link
                href={`/posts/${p.slug}`}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                {p.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
