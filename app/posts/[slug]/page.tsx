import { getPostBySlug, getAllPosts, getPostsBySeries, extractHeadings } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import EmbedViewer from '@/components/EmbedViewer'
import CopyCode from '@/components/CopyCode'
import SeriesNav from '@/components/SeriesNav'
import TableOfContents from '@/components/TableOfContents'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site'
import ShareButton from '@/components/ShareButton'
import { Coffee } from 'lucide-react'

const components = {
  EmbedViewer,
  pre: CopyCode,
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      rehypeKatex,
      [rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false }],
    ],
  },
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: '글을 찾을 수 없음', robots: { index: false, follow: false } }

  const url = `/posts/${post.meta.slug}`

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      siteName: SITE_CONFIG.name,
      title: post.meta.title,
      description: post.meta.excerpt,
      publishedTime: post.meta.date,
      authors: [SITE_CONFIG.author],
      tags: post.meta.tags,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: post.meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.excerpt,
      images: ['/opengraph-image'],
    },
  }
}

const CATEGORY_LABEL: Record<string, string> = {
  guide: '가이드',
  ai: 'AI',
  review: '리뷰',
  log: '로그',
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const { meta, content } = post
  const headings = extractHeadings(content)
  const seriesPosts = meta.series ? getPostsBySeries(meta.series) : []
  const postUrl = `${SITE_CONFIG.url}/posts/${meta.slug}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl}#article`,
        headline: meta.title,
        description: meta.excerpt,
        datePublished: meta.date,
        dateModified: meta.date,
        mainEntityOfPage: postUrl,
        inLanguage: 'ko-KR',
        keywords: meta.tags.join(', '),
        author: { '@type': 'Person', name: SITE_CONFIG.author, url: 'https://github.com/dev-ming' },
        publisher: { '@type': 'Organization', name: SITE_CONFIG.name, url: SITE_CONFIG.url },
        image: `${SITE_CONFIG.url}/opengraph-image`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: SITE_CONFIG.url },
          { '@type': 'ListItem', position: 2, name: '전체 글', item: `${SITE_CONFIG.url}/posts` },
          { '@type': 'ListItem', position: 3, name: meta.title, item: postUrl },
        ],
      },
    ],
  }

  return (
    <div className="lg:flex lg:gap-10 lg:items-start">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      {/* 본문 */}
      <article className="flex-1 min-w-0">
        <header className="mb-10 pb-8 border-b border-slate-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-mint-500/10 dark:bg-mint-400/10 text-mint-500 dark:text-mint-400 border border-mint-500/20 dark:border-mint-400/20">
              {CATEGORY_LABEL[meta.category] ?? meta.category}
            </span>
            <time dateTime={meta.date} className="text-xs text-slate-500">{meta.date}</time>
            <span className="text-xs text-slate-400 ml-auto">{meta.readingTime}분 읽기</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-4">{meta.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">{meta.excerpt}</p>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/posts?tag=${encodeURIComponent(tag)}`}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1a202a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] hover:border-mint-500/40 hover:text-mint-600 dark:hover:text-mint-400 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <ShareButton title={meta.title} />
          </div>
        </header>

        {meta.series && seriesPosts.length > 1 && (
          <SeriesNav currentSlug={meta.slug} seriesName={meta.series} posts={seriesPosts} />
        )}

        {meta.embedUrl && (
          <div className="mb-10">
            <EmbedViewer src={meta.embedUrl} height={520} />
          </div>
        )}

        <div className="prose dark:prose-invert sm:prose-base max-w-none">
          <MDXRemote
            source={content}
            components={components}
            options={mdxOptions as any}
          />
        </div>

        <aside className="mt-14 rounded-xl border border-mint-500/20 bg-mint-500/[0.06] px-5 py-5 dark:border-mint-400/15 dark:bg-mint-400/[0.05]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">글이 도움이 됐나요?</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                문제를 해결하는 데 도움이 됐다면 커피 한 잔으로 응원할 수 있어요.
              </p>
            </div>
            <a
              href="https://buymeacoffee.com/mingee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-mint-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mint-600 dark:bg-mint-400 dark:text-slate-950 dark:hover:bg-mint-300"
            >
              <Coffee size={16} aria-hidden="true" />
              커피 한 잔 보내기
            </a>
          </div>
        </aside>
      </article>

      {/* 목차 사이드바 */}
      {headings.length > 0 && (
        <aside className="sticky top-20 hidden w-48 flex-shrink-0 self-start lg:block">
          <div className="relative max-h-[calc(100vh-6rem)] overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-white dark:from-[#0b0f15] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-white dark:from-[#0b0f15] to-transparent" />
            <div className="no-scrollbar max-h-[calc(100vh-6rem)] overflow-y-auto py-4">
              <TableOfContents headings={headings} />
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
