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

  const seriesPosts =
    meta.series ? getPostsBySeries(meta.series) : []

  return (
    <div className="lg:flex lg:gap-10 lg:items-start">
      {/* 본문 */}
      <article className="flex-1 min-w-0">
        {/* 헤더 */}
        <header className="mb-10 pb-8 border-b border-white/8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-mint-400/10 text-mint-400 border border-mint-400/20">
              {CATEGORY_LABEL[meta.category] ?? meta.category}
            </span>
            <time className="text-xs text-slate-500">{meta.date}</time>
            <span className="text-xs text-slate-600 ml-auto">{meta.readingTime}분 읽기</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 leading-tight mb-4">{meta.title}</h1>
          <p className="text-slate-400 text-base">{meta.excerpt}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {meta.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/8">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* 시리즈 네비게이션 */}
        {meta.series && seriesPosts.length > 1 && (
          <SeriesNav
            currentSlug={meta.slug}
            seriesName={meta.series}
            posts={seriesPosts}
          />
        )}

        {/* 인라인 임베드 */}
        {meta.embedUrl && (
          <div className="mb-10">
            <EmbedViewer src={meta.embedUrl} height={520} />
          </div>
        )}

        {/* MDX 본문 */}
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
          <MDXRemote
            source={content}
            components={components}
            options={mdxOptions as any}
          />
        </div>
      </article>

      {/* 목차 사이드바 */}
      {headings.length > 0 && (
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      )}
    </div>
  )
}
