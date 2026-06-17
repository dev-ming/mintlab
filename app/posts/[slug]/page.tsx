import { getPostBySlug, getAllPosts, getPostsBySeries, extractHeadings } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import EmbedViewer from '@/components/EmbedViewer'
import CopyCode from '@/components/CopyCode'
import SeriesNav from '@/components/SeriesNav'
import TableOfContents from '@/components/TableOfContents'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

const components = {
  EmbedViewer,
  pre: CopyCode,
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
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
  if (!post) return {}
  return { title: post.meta.title, description: post.meta.excerpt }
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

  return (
    <div className="lg:flex lg:gap-10 lg:items-start">
      {/* 본문 */}
      <article className="flex-1 min-w-0">
        <header className="mb-10 pb-8 border-b border-slate-200 dark:border-white/8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-mint-500/10 dark:bg-mint-400/10 text-mint-500 dark:text-mint-400 border border-mint-500/20 dark:border-mint-400/20">
              {CATEGORY_LABEL[meta.category] ?? meta.category}
            </span>
            <time className="text-xs text-slate-500">{meta.date}</time>
            <span className="text-xs text-slate-400 ml-auto">{meta.readingTime}분 읽기</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-4">{meta.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">{meta.excerpt}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {meta.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1b1d24] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/8">
                #{tag}
              </span>
            ))}
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
      </article>

      {/* 목차 사이드바 */}
      {headings.length > 0 && (
        <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-48 flex-shrink-0 self-start overflow-y-auto pb-4 lg:block">
          <TableOfContents headings={headings} />
        </aside>
      )}
    </div>
  )
}
