'use client'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import type { PostMeta } from '@/lib/content'
import { ArrowRight } from 'lucide-react'

const CATEGORY_CONFIG = {
  guide: { label: '가이드', color: 'text-mint-500 dark:text-mint-400', bg: 'bg-mint-500/10 border-mint-500/20 dark:bg-mint-400/10 dark:border-mint-400/20' },
  ai:    { label: 'AI',    color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20 dark:bg-purple-400/10 dark:border-purple-400/20' },
  review:{ label: '리뷰',  color: 'text-blue-500 dark:text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20 dark:bg-blue-400/10 dark:border-blue-400/20' },
  log:   { label: '로그',  color: 'text-amber-500 dark:text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20 dark:bg-amber-400/10 dark:border-amber-400/20' },
} as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
}

const yearVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const rowVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-slate-400 dark:text-slate-500 text-sm py-12 text-center">
        해당하는 글이 없습니다.
      </p>
    )
  }

  const grouped: Record<string, PostMeta[]> = {}
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(post)
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mt-8">
      {years.map((year, yi) => (
        <div key={year}>
          <motion.div
            variants={yearVariant}
            className={`${yi > 0 ? 'pt-12' : 'pt-0'} pb-3 select-none`}
          >
            <span className="font-mono text-[28px] font-bold text-slate-300 dark:text-slate-700 leading-none">
              {year}
            </span>
          </motion.div>

          {grouped[year].map((post) => {
            const cfg = CATEGORY_CONFIG[post.category as keyof typeof CATEGORY_CONFIG] ?? CATEGORY_CONFIG.guide
            const mmdd = post.date.slice(5).replace('-', '.')
            return (
              <motion.div key={post.slug} variants={rowVariant}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex items-center gap-3 sm:gap-4 py-3 px-3 -mx-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors duration-150"
                >
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500 min-w-[36px] flex-shrink-0 tabular-nums">
                    {mmdd}
                  </span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <span className="flex-1 text-sm text-slate-800 dark:text-slate-200 group-hover:text-mint-600 dark:group-hover:text-mint-400 group-hover:translate-x-0.5 transition-all duration-150 truncate">
                    {post.title}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 tabular-nums hidden sm:inline">
                    {post.readingTime}분
                  </span>
                  <ArrowRight
                    size={12}
                    className="text-slate-400 dark:text-slate-500 flex-shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150"
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>
      ))}
    </motion.div>
  )
}
