import Link from 'next/link'
import type { PostMeta } from '@/lib/content'
import { BookOpen, Cpu, Star, FileText, Clock } from 'lucide-react'

const CATEGORY_CONFIG = {
  guide: { label: '가이드', icon: BookOpen, color: 'text-mint-400', bg: 'bg-mint-400/10 border-mint-400/20' },
  ai: { label: 'AI', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  review: { label: '리뷰', icon: Star, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  log: { label: '로그', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
}

type Props = {
  post: PostMeta
  featured?: boolean
}

export default function PostCard({ post, featured = false }: Props) {
  const cfg = CATEGORY_CONFIG[post.category] ?? CATEGORY_CONFIG.guide
  const Icon = cfg.icon

  if (featured) {
    return (
      <Link href={`/posts/${post.slug}`}>
        <div className="group rounded-xl border border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5 transition-all p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
              {cfg.label}
            </span>
            <time className="text-xs text-slate-500">{post.date}</time>
            <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
              <Clock size={10} />
              {post.readingTime}분
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-mint-400 transition-colors">
            {post.title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-500 border border-white/8">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/posts/${post.slug}`}>
      <div className="group h-full rounded-xl border border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5 transition-all p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon size={12} className={cfg.color} />
          <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
          <time className="text-xs text-slate-400 ml-auto">{post.date}</time>
          <span className="text-xs text-slate-400 flex items-center gap-0.5">
            <Clock size={10} />
            {post.readingTime}분
          </span>
        </div>
        <h3 className="text-sm font-semibold text-slate-200 mb-1.5 group-hover:text-mint-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
        {post.embedUrl && (
          <div className="mt-2">
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
              결과물 포함
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
