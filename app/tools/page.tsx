import { getPostsByCategory } from '@/lib/content'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '도구 리뷰' }

export default function ToolsPage() {
  const posts = getPostsByCategory('tool')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">도구 리뷰</h1>
        <p className="text-slate-400 text-sm">
          직접 써본 AI 도구·서비스 리뷰와 비교
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-500 text-sm">아직 등록된 도구 리뷰가 없습니다.</p>
          <p className="text-slate-600 text-xs mt-2">
            <code className="bg-white/5 px-2 py-1 rounded">content/posts/</code>에{' '}
            <code className="bg-white/5 px-2 py-1 rounded">category: "tool"</code> 포스트를 추가하세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  )
}
