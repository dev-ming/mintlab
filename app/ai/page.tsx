import { getAllPosts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'AI' }

const SUBCATEGORY_LABELS: Record<string, string> = {
  guide: '가이드',
  tool: '도구',
  prompt: '프롬프트',
  showcase: '결과물',
}

export default function AiPage({
  searchParams,
}: {
  searchParams: { sub?: string }
}) {
  const allAiPosts = getAllPosts().filter((p) => p.category === 'ai')
  const filtered = searchParams.sub
    ? allAiPosts.filter((p) => p.subcategory === searchParams.sub)
    : allAiPosts

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">AI</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          AI 도구 활용, 워크플로우 자동화, 프롬프트 엔지니어링
        </p>
      </div>

      {/* 서브카테고리 탭 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['', 'guide', 'tool', 'prompt', 'showcase'] as const).map((sub) => {
          const label = sub === '' ? '전체' : SUBCATEGORY_LABELS[sub]
          const active = (searchParams.sub ?? '') === sub
          return (
            <a
              key={sub}
              href={sub ? `/ai?sub=${sub}` : '/ai'}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                active
                  ? 'bg-purple-500/10 dark:bg-purple-400/10 border-purple-500/30 dark:border-purple-400/30 text-purple-500 dark:text-purple-400'
                  : 'border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/[0.1]'
              }`}
            >
              {label}
            </a>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-500 text-sm py-12 text-center">해당하는 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  )
}
