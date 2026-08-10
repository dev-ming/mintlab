'use client'

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Line = {
  id: number
  tone?: 'command' | 'info' | 'success' | 'warning' | 'muted'
  text: string
}

type Props = {
  posts: Array<{
    slug: string
    title: string
    date: string
    category: string
  }>
  postCount: number
  guideCount: number
  aiCount: number
  latestDate: string
  latestSlug?: string
}

const DIRECTORIES: Record<string, string> = {
  archive: 'archive',
  posts: 'archive',
  guides: 'guides',
  guide: 'guides',
  ai: 'ai',
  ai_lab: 'ai',
  reviews: 'reviews',
  review: 'reviews',
  logs: 'logs',
  log: 'logs',
}

const CATEGORY_BY_DIRECTORY: Record<string, string | undefined> = {
  archive: undefined,
  guides: 'guide',
  ai: 'ai',
  reviews: 'review',
  logs: 'log',
}

const toneClass: Record<NonNullable<Line['tone']>, string> = {
  command: 'text-white/80',
  info: 'text-cyan-300',
  success: 'text-emerald-300',
  warning: 'text-amber-300',
  muted: 'text-emerald-300/45',
}

export default function MintlabTerminal({
  posts,
  postCount,
  guideCount,
  aiCount,
  latestDate,
  latestSlug,
}: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(20)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [directory, setDirectory] = useState<string | null>(null)
  const [lines, setLines] = useState<Line[]>([
    { id: 1, tone: 'command', text: 'dev@mintlab:~$ run archive.scan.js' },
    { id: 2, tone: 'info', text: '[INFO] mounting /content/posts' },
    { id: 3, tone: 'success', text: `[OKAY] ${postCount} records indexed` },
    { id: 4, tone: 'success', text: '[OKAY] metadata integrity: 100%' },
    { id: 5, tone: 'warning', text: '[NOTE] memory remains unreliable' },
    { id: 6, tone: 'muted', text: 'Type "help" to list available commands.' },
  ])

  const modules = useMemo(
    () => [
      { key: 'archive', label: 'archive/', count: String(postCount).padStart(2, '0') },
      { key: 'guides', label: 'guides/', count: String(guideCount).padStart(2, '0') },
      { key: 'ai', label: 'ai/', count: String(aiCount).padStart(2, '0') },
      { key: 'reviews', label: 'reviews/', count: String(posts.filter((post) => post.category === 'review').length).padStart(2, '0') },
      { key: 'logs', label: 'logs/', count: String(posts.filter((post) => post.category === 'log').length).padStart(2, '0') },
    ],
    [aiCount, guideCount, postCount, posts],
  )

  const directoryPosts = useMemo(() => {
    if (!directory) return []
    const category = CATEGORY_BY_DIRECTORY[directory]
    return category ? posts.filter((post) => post.category === category) : posts
  }, [directory, posts])

  const promptPath = directory ? `~/${directory}` : '~'

  useEffect(() => {
    const output = outputRef.current
    if (!output) return
    output.scrollTop = output.scrollHeight
  }, [lines])

  function append(entries: Omit<Line, 'id'>[]) {
    setLines((current) => [
      ...current,
      ...entries.map((entry) => ({ ...entry, id: nextId.current++ })),
    ].slice(-100))
  }

  function postListing(items: typeof posts) {
    if (items.length === 0) {
      return [{ tone: 'muted' as const, text: '(empty directory)' }]
    }
    return items.map((post, index) => ({
      tone: 'success' as const,
      text: `${String(index + 1).padStart(2, '0')}  ${post.date}  ${post.slug}.md`,
    }))
  }

  function findPost(target: string) {
    if (!directory) return undefined
    if (/^\d+$/.test(target)) return directoryPosts[Number(target) - 1]
    const slug = target.replace(/\.md$/i, '')
    return directoryPosts.find((post) => post.slug.toLowerCase() === slug)
  }

  function execute(raw: string) {
    const command = raw.trim()
    if (!command) return

    const [program = '', ...args] = command.split(/\s+/)
    const name = program.toLowerCase()
    const target = (args[0] ?? '').replace(/^\.\//, '').replace(/\/$/, '').toLowerCase()

    append([{ tone: 'command', text: `dev@mintlab:${promptPath}$ ${command}` }])

    if (name === 'clear') {
      setLines([])
      return
    }

    if (name === 'help') {
      append([
        { tone: 'info', text: 'AVAILABLE COMMANDS' },
        { tone: 'muted', text: 'help  pwd  whoami  date  ls [-la]  clear' },
        { tone: 'muted', text: 'cd <archive|guides|ai|reviews|logs>' },
        { tone: 'muted', text: 'inside a directory: cat <number|file.md>  cd <number>' },
        { tone: 'muted', text: 'cd ..  cat latest  open latest' },
      ])
      return
    }

    if (name === 'pwd') {
      append([{ tone: 'success', text: `/home/dev-ming/mintlab${directory ? `/${directory}` : ''}` }])
      return
    }

    if (name === 'whoami') {
      append([{ tone: 'success', text: 'dev-ming' }])
      return
    }

    if (name === 'date') {
      append([{ tone: 'success', text: `${latestDate} KST // archive clock` }])
      return
    }

    if (name === 'ls') {
      if (directory) {
        append(postListing(directoryPosts))
      } else {
        append([
          { tone: 'success', text: 'archive/  guides/  ai/  reviews/  logs/' },
          ...(args.includes('-la') || args.includes('-al')
            ? [{ tone: 'muted' as const, text: '-rw-r--r--  dev-ming  latest.md' }]
            : []),
        ])
      }
      return
    }

    if (name === 'cd') {
      if (!target || target === '~' || target === '/' || target === '..') {
        setDirectory(null)
        append([{ tone: 'info', text: 'returned to home node' }])
        return
      }

      const nextDirectory = DIRECTORIES[target]
      if (nextDirectory) {
        const category = CATEGORY_BY_DIRECTORY[nextDirectory]
        const nextPosts = category ? posts.filter((post) => post.category === category) : posts
        setDirectory(nextDirectory)
        append([
          { tone: 'info', text: `mounted /${nextDirectory} (${nextPosts.length} files)` },
          ...postListing(nextPosts),
          { tone: 'muted', text: 'use: cat <number> or cd <number>' },
        ])
        return
      }

      const post = findPost(target)
      if (post) {
        append([{ tone: 'info', text: `opening ${post.slug}.md...` }])
        router.push(`/posts/${post.slug}`)
        return
      }

      append([{ tone: 'warning', text: `bash: cd: ${args[0]}: No such directory` }])
      return
    }

    if (name === 'cat') {
      const post = target === 'latest' ? posts[0] : findPost(target)
      if (post) {
        append([{ tone: 'info', text: `opening ${post.slug}.md...` }])
        router.push(`/posts/${post.slug}`)
      } else {
        append([{ tone: 'warning', text: `cat: ${args[0] ?? ''}: No such file` }])
      }
      return
    }

    if (name === 'open' && target === 'latest') {
      if (latestSlug) {
        append([{ tone: 'info', text: 'opening latest.md...' }])
        router.push(`/posts/${latestSlug}`)
      } else {
        append([{ tone: 'warning', text: 'open: latest.md: file not found' }])
      }
      return
    }

    append([{ tone: 'warning', text: `bash: ${program}: command not found` }])
  }

  function runInput() {
    const command = input.trim()
    if (!command) return
    setHistory((current) => [command, ...current.filter((item) => item !== command)].slice(0, 20))
    setHistoryIndex(-1)
    setInput('')
    execute(command)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    runInput()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      runInput()
      return
    }

    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    const next = event.key === 'ArrowUp'
      ? Math.min(historyIndex + 1, history.length - 1)
      : Math.max(historyIndex - 1, -1)
    setHistoryIndex(next)
    setInput(next === -1 ? '' : history[next] ?? '')
  }

  return (
    <section
      aria-labelledby="mintlab-node-title"
      className="relative overflow-hidden border border-emerald-400/30 bg-[#020705] font-mono text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.06)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, #34d399 4px)' }} />

      <header className="relative flex flex-wrap items-center justify-between gap-2 border-b border-emerald-400/25 bg-emerald-400/[0.04] px-4 py-2 text-[9px] uppercase tracking-[0.14em] sm:text-[10px]">
        <h2 id="mintlab-node-title" className="font-semibold">MINTLAB_OS // HOME NODE</h2>
        <div className="flex items-center gap-4 text-emerald-300/55"><span>v0.{postCount}</span><span className="text-cyan-300">● CONNECTED</span><span>ROOT: YES</span></div>
      </header>

      <div className="relative grid min-h-[350px] md:grid-cols-[150px_minmax(0,1fr)_180px]">
        <aside className="border-b border-emerald-400/20 p-4 text-[10px] md:border-b-0 md:border-r">
          <p className="mb-3 text-emerald-300/35">[ FILESYSTEM ]</p>
          <div className="space-y-1">
            <p className="bg-emerald-400/10 px-2 py-1.5 text-emerald-200">&gt; ~/terminal</p>
            {modules.map((module) => (
              <p
                key={module.key}
                className={`flex justify-between px-2 py-1.5 ${directory === module.key ? 'bg-emerald-400/10 text-emerald-200' : 'text-emerald-300/60'}`}
              >
                <span>{directory === module.key ? `> ${module.label}` : module.label}</span>
                <span>{module.count}</span>
              </p>
            ))}
          </div>
          <p className="mt-6 hidden leading-5 text-emerald-300/30 md:block">navigation:<br />cd &lt;directory&gt;</p>
        </aside>

        <div className="border-b border-emerald-400/20 p-5 text-[10px] leading-5 sm:text-[11px] md:border-b-0 md:border-r md:p-6" onClick={() => inputRef.current?.focus()}>
          <div
            ref={outputRef}
            aria-live="polite"
            className="h-56 space-y-1 overflow-y-auto pr-2 [scrollbar-color:rgba(52,211,153,0.35)_transparent] [scrollbar-width:thin] sm:h-[235px]"
          >
            {lines.map((line) => <p key={line.id} className={`${toneClass[line.tone ?? 'success']} break-words`}>{line.text}</p>)}
          </div>
          <form onSubmit={submit} className="mt-4 flex items-center gap-1">
            <label htmlFor="mintlab-command" className="shrink-0"><span className="text-cyan-300">dev@mintlab</span><span className="text-white/35">:</span><span className="text-blue-300">{promptPath}</span><span className="text-white/55">$</span></label>
            <input
              ref={inputRef}
              id="mintlab-command"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-label="MintLab terminal command"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-emerald-200 caret-emerald-300 outline-none focus:ring-0"
            />
          </form>
        </div>

        <aside className="p-4 text-[10px]">
          <p className="mb-4 text-emerald-300/35">[ NODE STATUS ]</p>
          <dl className="space-y-4">
            <div><dt className="text-emerald-300/40">HOST</dt><dd className="mt-1 text-cyan-300">mintlab.home</dd></div>
            <div><dt className="text-emerald-300/40">RECORDS</dt><dd className="mt-1 text-white/70">{postCount} entries</dd></div>
            <div><dt className="text-emerald-300/40">LAST SYNC</dt><dd className="mt-1 text-white/70">{latestDate}</dd></div>
            <div><dt className="text-emerald-300/40">MEMORY</dt><dd className="mt-2"><span>[||||||||</span><span className="text-emerald-900">||||</span>] 67%</dd></div>
            <div><dt className="text-emerald-300/40">CURRENT TASK</dt><dd className="mt-2 leading-5 text-amber-300">document<br />what broke</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  )
}
