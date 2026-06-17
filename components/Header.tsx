'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Cpu } from 'lucide-react'
import Search from '@/components/Search'
import ThemeToggle from '@/components/ThemeToggle'
import type { PostMeta } from '@/lib/content'

const NAV = [
  { href: '/posts', label: '전체' },
  { href: '/guide', label: '가이드' },
  { href: '/ai', label: 'AI' },
  { href: '/reviews', label: '리뷰' },
  { href: '/logs', label: '로그' },
]

type Props = {
  posts: Pick<PostMeta, 'slug' | 'title' | 'excerpt' | 'tags' | 'category'>[]
}

export default function Header({ posts }: Props) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur-md dark:border-white/8 dark:bg-[#0f1117]/90">
      <div className="mx-auto flex h-14 max-w-4xl items-center gap-4 px-6 sm:gap-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-mint-500 dark:text-slate-100 dark:hover:text-mint-400">
          <span className="grid size-6 place-items-center rounded-md border border-mint-500/20 bg-mint-500/10 text-mint-500 dark:border-mint-400/20 dark:bg-mint-400/10 dark:text-mint-400">
            <Cpu size={14} />
          </span>
          Mintlab
        </Link>

        <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {NAV.map(({ href, label }) => {
            const active = href === '/posts' ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? 'bg-mint-500/10 text-mint-600 dark:bg-mint-400/10 dark:text-mint-400'
                    : 'text-slate-600 hover:bg-black/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100'
                }`}
              >
                {label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[9px] h-px rounded-full bg-mint-500/70 dark:bg-mint-400/70" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Search posts={posts} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
