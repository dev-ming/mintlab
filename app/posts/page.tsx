import { getAllPosts, getAllTags } from '@/lib/content'
import PostCard from '@/components/PostCard'
import TagFilter from '@/components/TagFilter'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '가이드' }

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

  const CATEGORY_LABELS: Record<string, string> = {
    guide: '가이드',
    tool: '도구 리뷰',
    prompt: '프롬프트',
    showcase: '결과물',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">전체 글</h1>
        <p className="text-slate-400 text-sm">
          {allPosts.length}개의 포스트
        </p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['', 'guide', 'tool', 'prompt', 'showcase'] as const).map((cat) => {
          const label = cat === '' ? '전체' : CATEGORY_LABELS[cat]
          const active = (searchParams.category ?? '') === cat
          return (
            <a
              key={cat}
              href={cat ? `/posts?category=${cat}` : '/posts'}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                active
                  ? 'bg-mint-400/10 border-mint-400/30 text-mint-400'
                  : 'border-white/8 text-slate-400 hover:text-slate-200 hover:border-white/15'
              }`}
            >
              {label}
            </a>
          )
        })}
      </div>

      {/* 태그 필터 */}
      <TagFilter tags={allTags} activeTag={searchParams.tag} />

      {/* 포스트 목록 */}
      {filtered.length === 0 ? (
        <p className="text-slate-500 text-sm py-12 text-center">해당하는 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {filtered.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  )
}
