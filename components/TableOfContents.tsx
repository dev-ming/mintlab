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
    <nav>
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">
        목차
      </p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 10}px` }}>
            <a
              href={`#${h.id}`}
              className={`block text-xs leading-snug transition-colors hover:text-slate-200 ${
                active === h.id ? 'text-mint-400' : 'text-slate-500'
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
