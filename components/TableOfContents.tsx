'use client'
import { useState, useEffect } from 'react'
import type { Heading } from '@/lib/content'

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id ?? '')

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const offset = 120 // sticky 헤더 높이 + 여유
      let current = headings[0]?.id ?? ''
      for (const h of headings) {
        const el = document.getElementById(h.id)
        if (el && el.getBoundingClientRect().top <= offset) {
          current = h.id
        }
      }
      setActive(current)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="border-l border-slate-200 pl-4 dark:border-white/[0.06]">
      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-3">
        ON THIS PAGE
      </p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id} className="relative" style={{ paddingLeft: `${(h.level - 1) * 10}px` }}>
            {active === h.id && (
              <span className="absolute -left-4 top-1 h-3.5 w-px rounded-full bg-mint-500 dark:bg-mint-400" />
            )}
            <a
              href={`#${h.id}`}
              className={`block rounded-sm py-0.5 text-xs leading-snug transition-colors ${
                active === h.id
                  ? 'font-medium text-mint-600 dark:text-mint-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
