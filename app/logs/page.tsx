import { getPostsByCategory } from '@/lib/content'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '로그' }

export default function LogsPage() {
  const posts = getPostsByCategory('log')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">로그</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          개발 일지, 삽질 기록, 짧은 배움
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-sm">아직 등록된 로그가 없습니다.</p>
          <p className="text-slate-400 dark:text-slate-600 text-xs mt-2">
            <code className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">content/posts/</code>에{' '}
            <code className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">category: "log"</code> 포스트를 추가하세요.
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
