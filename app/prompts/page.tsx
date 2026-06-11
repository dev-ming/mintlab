import { getPostsByCategory } from '@/lib/content'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '프롬프트' }

export default function PromptsPage() {
  const posts = getPostsByCategory('prompt')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">프롬프트 템플릿</h1>
        <p className="text-slate-400 text-sm">
          실전에서 쓰는 프롬프트 패턴과 템플릿 모음
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-500 text-sm">아직 등록된 프롬프트 템플릿이 없습니다.</p>
          <p className="text-slate-600 text-xs mt-2">
            <code className="bg-white/5 px-2 py-1 rounded">content/posts/</code>에{' '}
            <code className="bg-white/5 px-2 py-1 rounded">category: "prompt"</code> 포스트를 추가하세요.
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
