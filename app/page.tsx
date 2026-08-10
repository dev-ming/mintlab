import { getAllPosts } from '@/lib/content'
import MintlabTerminal from '@/components/MintlabTerminal'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const posts = getAllPosts()
  const recent = posts.slice(0, 6)
  const latestDate = posts[0]?.date.replaceAll('-', '.') ?? '-'
  const guideCount = posts.filter((post) => post.category === 'guide').length
  const aiCount = posts.filter((post) => post.category === 'ai').length

  return (
    <div className="space-y-14">
      <section className="grid gap-x-12 gap-y-9 pb-10 md:grid-cols-[1fr_220px]">
        <div>
          <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-mint-500 dark:text-mint-400">
            Developer Archive / 2025—
          </div>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
            고친 건 많은데 기억나는 건 별로 없다.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            그래서 적어둡니다.
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-5 border-l border-slate-300 pl-5 font-mono dark:border-slate-700 md:grid-cols-1 md:gap-4">
          <div>
            <dt className="text-[9px] uppercase tracking-[0.16em] text-slate-400">Written by</dt>
            <dd className="mt-1 text-xs text-slate-700 dark:text-slate-300">@dev-ming</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-[0.16em] text-slate-400">Last update</dt>
            <dd className="mt-1 text-xs text-slate-700 dark:text-slate-300">{latestDate}</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-[0.16em] text-slate-400">Archive</dt>
            <dd className="mt-1 text-xs text-slate-700 dark:text-slate-300">{posts.length} entries</dd>
          </div>
        </dl>
      </section>

      {recent.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Recent Entries</h2>
            <Link href="/posts" className="flex items-center gap-1 text-xs text-mint-500 hover:underline dark:text-mint-400">
              아카이브 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-1 border-t border-slate-200 pt-3 dark:border-white/[0.06]">
            {recent.map((post, index) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className={`group flex items-center gap-3 px-3 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.04] ${index === 0 ? 'border-l-2 border-mint-500 py-4' : 'py-2'}`}
              >
                <span className="font-mono text-xs tabular-nums text-slate-400">{post.date.slice(5).replace('-', '.')}</span>
                <span className={`min-w-0 flex-1 truncate text-slate-700 transition-colors group-hover:text-mint-600 dark:text-slate-300 dark:group-hover:text-mint-400 ${index === 0 ? 'font-semibold text-slate-900 dark:text-slate-100' : ''}`}>
                  {post.title}
                </span>
                {index === 0 && (
                  <span className="rounded-sm border border-mint-500/40 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-mint-500 dark:border-mint-400/40 dark:text-mint-400">Latest</span>
                )}
                <ArrowRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <MintlabTerminal
        posts={posts.map(({ slug, title, date, category }) => ({ slug, title, date, category }))}
        postCount={posts.length}
        guideCount={guideCount}
        aiCount={aiCount}
        latestDate={latestDate}
        latestSlug={posts[0]?.slug}
      />
    </div>
  )
}
