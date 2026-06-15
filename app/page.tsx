import { getAllPosts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const posts = getAllPosts()
  const featured = posts.slice(0, 1)[0]
  const rest = posts.slice(1, 7)

  const guides = posts.filter((p) => p.category === 'guide').slice(0, 3)
  const aiPosts = posts.filter((p) => p.category === 'ai').slice(0, 3)
  const reviews = posts.filter((p) => p.category === 'review').slice(0, 3)

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
          개발 경험, AI 활용, 도구 리뷰, 그리고 생각들을 기록합니다.
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

      {aiPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">AI</h2>
            <Link href="/posts?category=ai" className="text-xs text-mint-400 flex items-center gap-1 hover:underline">
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
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">리뷰</h2>
            <Link href="/reviews" className="text-xs text-mint-400 flex items-center gap-1 hover:underline">
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
