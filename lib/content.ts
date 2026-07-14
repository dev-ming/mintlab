import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type AiSubcategory = 'guide' | 'concepts'

export type PostMeta = {
  slug: string
  title: string
  date: string
  tags: string[]
  category: 'guide' | 'ai' | 'review' | 'log'
  subcategory?: AiSubcategory
  excerpt: string
  embedUrl?: string
  readingTime: number
  series?: string
  seriesPart?: number
}

export type Heading = {
  level: number
  text: string
  id: string
}

// github-slugger 호환 ID 생성 (rehype-slug와 동일 알고리즘)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[ -⁯⸀-⹿\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
    .replace(/\s/g, '-')
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  const re = /^(#{1,3})\s+(.+)$/gm
  let match
  while ((match = re.exec(content)) !== null) {
    const raw = match[2].trim()
    // 마크다운 인라인 서식 제거
    const text = raw
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    headings.push({ level: match[1].length, text, id: slugify(text) })
  }
  return headings
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

function getDir(type: string) {
  return path.join(CONTENT_DIR, type)
}

export function getAllPosts(): PostMeta[] {
  const dir = getDir('posts')
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data, content } = matter(raw)
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length
      const readingTime = Math.max(1, Math.round(wordCount / 200))
      return { slug, readingTime, ...data } as PostMeta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string) {
  const filepath = path.join(getDir('posts'), `${slug}.mdx`)
  if (!fs.existsSync(filepath)) return null
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.round(wordCount / 200))
  return { meta: { slug, readingTime, ...data } as PostMeta, content }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const set = new Set(posts.flatMap((p) => p.tags))
  return Array.from(set).sort()
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}

export function getPostsByCategory(category: PostMeta['category']): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category)
}

export function getPostsBySeries(series: string): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.series === series)
    .sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0))
}
