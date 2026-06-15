'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { Search as SearchIcon, X, Command } from 'lucide-react'
import type { PostMeta } from '@/lib/content'

type SearchPost = Pick<PostMeta, 'slug' | 'title' | 'excerpt' | 'tags' | 'category'>

export default function Search({ posts }: { posts: SearchPost[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ['title', 'excerpt', 'tags'],
        threshold: 0.35,
        includeScore: true,
      }),
    [posts],
  )

  const results = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).slice(0, 8).map((r) => r.item)
  }, [query, fuse])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
      >
        <SearchIcon size={14} />
        <span className="hidden sm:inline text-xs">검색</span>
        <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-slate-600 border border-white/10 rounded px-1 py-0.5 ml-1">
          <Command size={9} />K
        </kbd>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
            <div className="bg-[#1a1d27] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
                <SearchIcon size={14} className="text-slate-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="검색..."
                  className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none"
                />
                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={14} />
                </button>
              </div>

              {results.length > 0 ? (
                <ul className="py-2 max-h-80 overflow-y-auto">
                  {results.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/posts/${p.slug}`}
                        onClick={() => { setOpen(false); setQuery('') }}
                        className="flex flex-col gap-0.5 px-4 py-2.5 hover:bg-white/5 transition-colors"
                      >
                        <span className="text-sm text-slate-200">{p.title}</span>
                        <span className="text-xs text-slate-500 line-clamp-1">{p.excerpt}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : query ? (
                <p className="text-center text-slate-500 text-sm py-8">결과 없음</p>
              ) : (
                <p className="text-center text-slate-500 text-sm py-8">검색어를 입력하세요</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
