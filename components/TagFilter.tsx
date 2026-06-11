'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  tags: string[]
  activeTag?: string
}

export default function TagFilter({ tags, activeTag }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

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
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTag(tag)}
          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
            activeTag === tag
              ? 'bg-mint-400/15 border-mint-400/40 text-mint-400'
              : 'border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  )
}
