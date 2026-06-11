import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { Cpu } from 'lucide-react'

export const metadata: Metadata = {
  title: { default: 'Mintlab', template: '%s | Mintlab' },
  description: 'AI 워크플로우, 도구 리뷰, 프롬프트 템플릿 — Mintlab',
}

const NAV = [
  { href: '/posts', label: '가이드' },
  { href: '/tools', label: '도구 리뷰' },
  { href: '/prompts', label: '프롬프트' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#0f1117] text-slate-200 min-h-screen font-pretendard antialiased">
        {/* 네비게이션 */}
        <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0f1117]/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-mint-400">
              <Cpu size={16} />
              Mintlab
            </Link>
            <nav className="flex gap-1">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>

        <footer className="border-t border-white/8 mt-20">
          <div className="max-w-4xl mx-auto px-6 py-8 text-xs text-slate-600 flex items-center justify-between">
            <span>Mintlab — 직접 만들고 기록하는 AI 워크플로우 아카이브</span>
            <a
              href="https://github.com/dev-ming"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-mint-400 transition-colors"
            >
              @dev-ming
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
