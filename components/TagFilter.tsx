'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

type Props = {
  tags: string[]
  activeTag?: string
}

export default function TagFilter({ tags, activeTag }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(Boolean(activeTag))
  const [showAll, setShowAll] = useState(Boolean(activeTag))

  const visibleTags = useMemo(() => {
    if (showAll) return tags
    if (!activeTag || tags.slice(0, 8).includes(activeTag)) return tags.slice(0, 8)
    return [activeTag, ...tags.filter((tag) => tag !== activeTag).slice(0, 7)]
  }, [activeTag, showAll, tags])

  if (tags.length === 0) return null

  function handleTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get('tag') === tag) {
      params.delete('tag')
    } else {
      params.set('tag', tag)
    }
    router.push(`/posts?${params.toString()}`)
  }

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          activeTag
            ? 'bg-mint-500/10 text-mint-600 dark:bg-mint-400/10 dark:text-mint-400'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200'
        }`}
      >
        Tags
        {activeTag && <span className="font-mono">#{activeTag}</span>}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTag(tag)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                activeTag === tag
                  ? 'bg-mint-400/15 border-mint-400/40 text-mint-500 dark:text-mint-400'
                  : 'border-slate-200 dark:border-white/[0.06] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/[0.1]'
              }`}
            >
              #{tag}
            </button>
          ))}

          {tags.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="text-xs px-2.5 py-1 rounded-full border border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              {showAll ? '접기' : `+${tags.length - visibleTags.length}개`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
