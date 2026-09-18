import { getAllPosts, getAllTags } from '@/lib/content'
import PostList from '@/components/PostList'
import TagFilter from '@/components/TagFilter'
import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/site'

export function generateMetadata({
  searchParams,
}: {
  searchParams: { tag?: string; category?: string }
}): Metadata {
  const isFiltered = Boolean(searchParams.tag || searchParams.category)

  return {
    ...createPageMetadata(
      '전체 개발 글',
      'Next.js, AI 자동화, 인증, 배포, 디버깅 등 실제 개발 문제와 해결 과정을 주제별로 모은 글 목록.',
      '/posts',
    ),
    robots: isFiltered ? { index: false, follow: true } : undefined,
  }
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

      {/* 태그 필터 */}
      <TagFilter tags={allTags} activeTag={searchParams.tag} />

      {/* 타임라인 목록 */}
      <PostList posts={filtered} />
    </div>
  )
}
