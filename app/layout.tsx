import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import { getAllPosts } from '@/lib/content'
import { SITE_CONFIG } from '@/lib/site'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: { default: SITE_CONFIG.name, template: `%s | ${SITE_CONFIG.name}` },
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.author, url: 'https://github.com/dev-ming' }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Mintlab 개발 기록 아카이브' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllPosts()

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-[#12151c] text-slate-900 dark:text-slate-200 min-h-screen font-pretendard antialiased">
        <GoogleAnalytics />
        <Providers>
          <Header posts={posts} />

          <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>

          <footer className="border-t border-slate-200 dark:border-white/[0.06] mt-20">
            <div className="max-w-4xl mx-auto px-6 py-8 text-xs text-slate-400 dark:text-slate-600 flex items-center justify-between">
              <span>Mintlab — 개발 기록 아카이브</span>
              <div className="flex items-center gap-4">
                <a
                  href="https://buymeacoffee.com/mingee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-mint-500 dark:hover:text-mint-400"
                >
                  ☕ 커피 한 잔
                </a>
                <a
                  href="https://github.com/dev-ming"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-mint-500 dark:hover:text-mint-400 transition-colors"
                >
                  @dev-ming
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
