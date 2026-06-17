'use client'

import { useState } from 'react'
import { ExternalLink, Maximize2, Minimize2 } from 'lucide-react'

type Props = {
  src: string
  height?: number
  title?: string
}

export default function EmbedViewer({ src, height = 500, title }: Props) {
  const [expanded, setExpanded] = useState(false)
  const displayHeight = expanded ? 800 : height

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-[#0d1118]">
      {/* 툴바 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/50" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <span className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs text-slate-500 ml-2 truncate max-w-xs">
            {title ?? src}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            title={expanded ? '축소' : '확대'}
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-300 transition-colors"
            title="새 탭에서 열기"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* iframe */}
      <iframe
        src={src}
        style={{ height: displayHeight }}
        className="w-full border-0 transition-all duration-300"
        title={title ?? 'Embedded content'}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
      />
    </div>
  )
}
