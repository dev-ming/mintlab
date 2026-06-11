import { getPostBySlug, getAllPosts } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import EmbedViewer from '@/components/EmbedViewer'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

// MDX에서 쓸 수 있는 커스텀 컴포넌트
const components = {
  EmbedViewer,
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
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
  tool: '도구 리뷰',
  prompt: '프롬프트',
  showcase: '결과물',
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const { meta, content } = post

  return (
    <article>
      {/* 헤더 */}
      <header className="mb-10 pb-8 border-b border-white/8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-mint-400/10 text-mint-400 border border-mint-400/20">
            {CATEGORY_LABEL[meta.category] ?? meta.category}
          </span>
          <time className="text-xs text-slate-500">{meta.date}</time>
        </div>
        <h1 className="text-3xl font-bold text-slate-100 leading-tight mb-4">{meta.title}</h1>
        <p className="text-slate-400 text-base">{meta.excerpt}</p>
        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {meta.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/8">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* 인라인 임베드 (embedUrl이 있으면 본문 위에 표시) */}
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
  )
}
