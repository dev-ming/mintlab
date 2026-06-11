import { getAllPosts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const CATEGORY_LABELS = {
  guide: 'AI 가이드',
  tool: '도구 리뷰',
  prompt: '프롬프트',
  showcase: '결과물',
}

export default function HomePage() {
  const posts = getAllPosts()
  const featured = posts.slice(0, 1)[0]
  const rest = posts.slice(1, 7)

  const guides = posts.filter((p) => p.category === 'guide').slice(0, 3)
  const tools = posts.filter((p) => p.category === 'tool').slice(0, 3)

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section>
        <div className="mb-2 text-xs font-semibold text-mint-400 uppercase tracking-widest">
          Mintlab
        </div>
        <h1 className="text-3xl font-bold text-slate-100 mb-3 leading-tight">
          직접 만들고, 깨지고,<br />
          <span className="text-mint-400">고친 것들의 기록</span>
        </h1>
        <p className="text-slate-400 text-base max-w-lg">
          직접 만들고, 깨지고, 고친 AI 워크플로우와 결과물을 기록합니다.
        </p>
      </section>

      {/* 최신 포스트 강조 */}
      {featured && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">최신</h2>
            <Link href="/posts" className="text-xs text-mint-400 flex items-center gap-1 hover:underline">
              전체 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <PostCard post={featured} featured />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* 카테고리 섹션 */}
      {guides.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">가이드</h2>
            <Link href="/posts?category=guide" className="text-xs text-mint-400 flex items-center gap-1 hover:underline">
              더 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {guides.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}

      {tools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">도구 리뷰</h2>
            <Link href="/tools" className="text-xs text-mint-400 flex items-center gap-1 hover:underline">
              더 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tools.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
