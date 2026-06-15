'use client'
import { useState, useEffect } from 'react'
import type { Heading } from '@/lib/content'

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 가장 위쪽에 있는 intersecting heading을 active로
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 },
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
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
