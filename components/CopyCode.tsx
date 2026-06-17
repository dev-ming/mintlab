'use client'
import { useRef, useState } from 'react'
import { Copy, Check, Terminal } from 'lucide-react'

export default function CopyCode({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = preRef.current?.querySelector('code')?.textContent ?? ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group/code relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d1118]">
      <div className="flex h-9 items-center justify-between border-b border-white/[0.06] px-3">
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
          <Terminal size={12} />
          code
        </div>
      </div>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label="코드 복사"
        className="absolute right-2 top-2 rounded-md bg-white/[0.07] p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-white/[0.12] hover:text-slate-200 group-hover/code:opacity-100"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  )
}
