import { getAllPosts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import { ArrowRight, Archive, CalendarDays, Layers3 } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const posts = getAllPosts()
  const featured = posts.slice(0, 1)[0]
  const rest = posts.slice(1, 6)

  const guides = posts.filter((p) => p.category === 'guide').slice(0, 3)
  const aiPosts = posts.filter((p) => p.category === 'ai').slice(0, 3)
  const reviews = posts.filter((p) => p.category === 'review').slice(0, 3)
  const latestDate = posts[0]?.date.replaceAll('-', '.') ?? '-'

  return (
    <div className="space-y-14">
      <section className="grid gap-8 border-b border-slate-200/80 pb-10 dark:border-white/[0.06] md:grid-cols-[1fr_220px]">
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-mint-600 dark:text-mint-400">
            <Archive size={13} />
            Developer Archive
          </div>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
            실제로 겪은 문제, 고친 흔적, 남겨둔 판단들.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            작업 중 마주친 문제와 선택, 자동화, 도구 사용 경험을 나중의 나와 동료가 다시 찾기 좋게 정리합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-white/[0.06] dark:bg-[#171b23]">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Layers3 size={12} />
              POSTS
            </div>
            <div className="font-mono text-xl font-semibold text-slate-900 dark:text-slate-100">{posts.length}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-white/[0.06] dark:bg-[#171b23]">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] text-slate-400">
              <CalendarDays size={12} />
              UPDATED
            </div>
            <div className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">{latestDate}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-white/[0.06] dark:bg-[#171b23]">
            <div className="mb-1 text-[11px] text-slate-400">CATEGORIES</div>
            <div className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">4 tracks</div>
          </div>
        </div>
      </section>

      {featured && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Latest Entry</h2>
            <Link href="/posts" className="text-xs text-mint-500 dark:text-mint-400 flex items-center gap-1 hover:underline">
              아카이브 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <PostCard post={featured} featured />
          <div className="mt-4 space-y-1">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/posts/${p.slug}`}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.04]"
              >
                <span className="font-mono text-xs text-slate-400 tabular-nums">{p.date.slice(5).replace('-', '.')}</span>
                <span className="min-w-0 flex-1 truncate text-slate-700 transition-colors group-hover:text-mint-600 dark:text-slate-300 dark:group-hover:text-mint-400">
                  {p.title}
                </span>
                <ArrowRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">가이드</h2>
            <Link href="/posts?category=guide" className="text-xs text-mint-500 dark:text-mint-400 flex items-center gap-1 hover:underline">
              더 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {guides.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}

      {aiPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI</h2>
            <Link href="/ai" className="text-xs text-mint-500 dark:text-mint-400 flex items-center gap-1 hover:underline">
              더 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {aiPosts.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">리뷰</h2>
            <Link href="/reviews" className="text-xs text-mint-500 dark:text-mint-400 flex items-center gap-1 hover:underline">
              더 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reviews.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
