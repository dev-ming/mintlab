'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('아래 주소를 복사해 주세요.', url)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-500 transition-colors hover:border-mint-500/40 hover:text-mint-600 dark:border-white/[0.08] dark:text-slate-400 dark:hover:text-mint-400"
      aria-label={copied ? '링크가 복사되었습니다' : '이 글 공유하기'}
    >
      {copied ? <Check size={13} aria-hidden="true" /> : <Share2 size={13} aria-hidden="true" />}
      <span aria-live="polite">{copied ? '복사됨' : '공유'}</span>
    </button>
  )
}
