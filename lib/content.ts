import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type AiSubcategory = 'guide' | 'tool' | 'prompt' | 'showcase'

export type PostMeta = {
  slug: string
  title: string
  date: string
  tags: string[]
  category: 'guide' | 'ai' | 'review' | 'log' | 'essay'
  subcategory?: AiSubcategory
  excerpt: string
  embedUrl?: string
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
      const { data } = matter(raw)
      return { slug, ...data } as PostMeta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string) {
  const filepath = path.join(getDir('posts'), `${slug}.mdx`)
  if (!fs.existsSync(filepath)) return null
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  return { meta: { slug, ...data } as PostMeta, content }
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
