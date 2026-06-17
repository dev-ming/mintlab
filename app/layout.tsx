import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import { getAllPosts } from '@/lib/content'

export const metadata: Metadata = {
  title: { default: 'Mintlab', template: '%s | Mintlab' },
  description: '개발 기록 아카이브 — Mintlab',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllPosts()

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-[#0f1117] text-slate-900 dark:text-slate-200 min-h-screen font-pretendard antialiased">
        <Providers>
          <Header posts={posts} />

          <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>

          <footer className="border-t border-slate-200 dark:border-white/8 mt-20">
            <div className="max-w-4xl mx-auto px-6 py-8 text-xs text-slate-400 dark:text-slate-600 flex items-center justify-between">
              <span>Mintlab — 개발 기록 아카이브</span>
              <a
                href="https://github.com/dev-ming"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-mint-500 dark:hover:text-mint-400 transition-colors"
              >
                @dev-ming
              </a>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
