'use client'
import { useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'

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
    <div className="relative group/code">
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label="코드 복사"
        className="absolute top-3 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity p-1.5 rounded-md bg-white/8 hover:bg-white/15 text-slate-400 hover:text-slate-200"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  )
}
