import { getAllPosts, getAllTags } from '@/lib/content'
import PostList from '@/components/PostList'
import TagFilter from '@/components/TagFilter'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '전체 글' }

const CATEGORY_LABELS: Record<string, string> = {
  guide: '가이드',
  ai: 'AI',
  review: '리뷰',
  log: '로그',
}

export default function PostsPage({
  searchParams,
}: {
  searchParams: { tag?: string; category?: string }
}) {
  const allPosts = getAllPosts()
  const allTags = getAllTags()

  const filtered = allPosts.filter((p) => {
    if (searchParams.tag && !p.tags.includes(searchParams.tag)) return false
    if (searchParams.category && p.category !== searchParams.category) return false
    return true
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">전체 글</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{allPosts.length}개의 포스트</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['', 'guide', 'ai', 'review', 'log'] as const).map((cat) => {
          const label = cat === '' ? '전체' : CATEGORY_LABELS[cat]
          const active = (searchParams.category ?? '') === cat
          return (
            <a
              key={cat}
              href={cat ? `/posts?category=${cat}` : '/posts'}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                active
                  ? 'bg-mint-500/10 dark:bg-mint-400/10 border-mint-500/30 dark:border-mint-400/30 text-mint-500 dark:text-mint-400'
                  : 'border-slate-200 dark:border-white/8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/15'
              }`}
            >
              {label}
            </a>
          )
        })}
      </div>

      {/* 태그 필터 */}
      <TagFilter tags={allTags} activeTag={searchParams.tag} />

      {/* 타임라인 목록 */}
      <PostList posts={filtered} />
    </div>
  )
}
