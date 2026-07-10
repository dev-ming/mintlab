import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const sourceDir =
  process.env.OBSIDIAN_POSTS_DIR ??
  'C:\\Users\\jenna\\jenna-coding\\Obsidian\\Archive'
const configPath = path.join(repoRoot, 'content', 'post-sync.json')
const outputDir = path.join(repoRoot, 'content', 'posts')

const requiredMeta = ['slug', 'tags']
const categories = new Set(['guide', 'ai', 'review', 'log'])
const aiSubcategories = new Set(['guide', 'tool', 'prompt', 'showcase'])

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '')
}

function normalizeMarkdown(raw) {
  return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
}

function extractTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m)
  return match?.[1].trim() || fallback.replace(/\.md$/i, '')
}

function extractDate(markdown, meta) {
  const match = markdown.match(/^>\s*.*?(\d{4}-\d{2}-\d{2})/m)
  if (match) return match[1]
  if (meta.date) return meta.date
  throw new Error('Missing date. Add a blockquote date line or a date field in post-sync.json.')
}

function stripObsidianHeader(markdown) {
  let body = markdown.replace(/^#\s+.+\n+/, '')
  body = body.replace(/^>\s*.*?\d{4}-\d{2}-\d{2}[^\n]*(?:\n\s*)?(?:---\s*\n+)?/, '')
  return body.trim()
}

function plainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[`*_~|>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function inferExcerpt(body, meta) {
  if (meta.excerpt) return meta.excerpt

  const paragraph = body
    .split(/\n{2,}/)
    .map((part) => plainText(part))
    .find(Boolean)

  if (!paragraph) return ''
  return paragraph.length > 150 ? `${paragraph.slice(0, 147).trim()}...` : paragraph
}

function toFrontmatterValue(value) {
  return JSON.stringify(value)
}

function mergeMeta(filename, configMeta, inferredMeta) {
  const meta = { ...configMeta }

  if (inferredMeta.category) {
    meta.category = inferredMeta.category
  }

  if (inferredMeta.subcategory) {
    meta.subcategory = inferredMeta.subcategory
  }

  validateMeta(filename, meta)
  return meta
}

function renderMdx(filename, raw, meta) {
  const markdown = normalizeMarkdown(raw)
  const title = meta.title ?? extractTitle(markdown, filename)
  const date = extractDate(markdown, meta)
  const body = stripObsidianHeader(markdown)
  const excerpt = inferExcerpt(body, meta)

  const lines = [
    '---',
    `title: ${toFrontmatterValue(title)}`,
    `date: ${toFrontmatterValue(date)}`,
    `tags: ${toFrontmatterValue(meta.tags)}`,
    `category: ${toFrontmatterValue(meta.category)}`,
  ]

  if (meta.subcategory) lines.push(`subcategory: ${toFrontmatterValue(meta.subcategory)}`)
  if (excerpt) lines.push(`excerpt: ${toFrontmatterValue(excerpt)}`)

  lines.push('---', '', body, '')
  return lines.join('\n')
}

function validateMeta(filename, meta) {
  const missing = requiredMeta.filter((key) => meta[key] == null)
  if (missing.length > 0) {
    throw new Error(`${filename} is missing required metadata: ${missing.join(', ')}`)
  }
  if (!Array.isArray(meta.tags)) {
    throw new Error(`${filename} tags must be an array.`)
  }
  if (!categories.has(meta.category)) {
    throw new Error(`${filename} category must be one of: ${Array.from(categories).join(', ')}.`)
  }
  if (meta.category === 'ai' && meta.subcategory && !aiSubcategories.has(meta.subcategory)) {
    throw new Error(
      `${filename} ai subcategory must be one of: ${Array.from(aiSubcategories).join(', ')}.`,
    )
  }
}

function inferMetaFromRelativePath(relativePath) {
  const parts = relativePath.split(path.sep)
  const category = parts.length > 1 && categories.has(parts[0]) ? parts[0] : undefined
  const subcategory =
    category === 'ai' && parts.length > 2 && aiSubcategories.has(parts[1]) ? parts[1] : undefined

  return { category, subcategory }
}

function getSourceFiles() {
  const files = []

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        walk(fullPath)
        continue
      }

      if (!entry.isFile() || !entry.name.endsWith('.md')) continue

      const relativePath = path.relative(sourceDir, fullPath)
      files.push({
        filename: entry.name,
        sourcePath: fullPath,
        inferredMeta: inferMetaFromRelativePath(relativePath),
      })
    }
  }

  walk(sourceDir)
  return files.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath))
}

function findDuplicates(items, getKey) {
  const seen = new Map()
  const duplicates = new Map()

  for (const item of items) {
    const key = getKey(item)
    if (!key) continue

    if (seen.has(key)) {
      duplicates.set(key, [...(duplicates.get(key) ?? [seen.get(key)]), item])
    } else {
      seen.set(key, item)
    }
  }

  return duplicates
}

function assertNoDuplicateSourceFilenames(sourceFiles) {
  const duplicates = findDuplicates(sourceFiles, (file) => file.filename)
  if (duplicates.size === 0) return

  const details = Array.from(duplicates.entries())
    .map(([filename, files]) => {
      const paths = files.map((file) => path.relative(sourceDir, file.sourcePath)).join(', ')
      return `${filename}: ${paths}`
    })
    .join('\n')

  throw new Error(`Duplicate Obsidian filenames found. File names must be unique across Archive.\n${details}`)
}

function assertNoDuplicateSlugs(config) {
  const configEntries = Object.entries(config).map(([filename, meta]) => ({ filename, meta }))
  const duplicates = findDuplicates(configEntries, (entry) => entry.meta?.slug)
  if (duplicates.size === 0) return

  const details = Array.from(duplicates.entries())
    .map(([slug, entries]) => {
      const filenames = entries.map((entry) => entry.filename).join(', ')
      return `${slug}: ${filenames}`
    })
    .join('\n')

  throw new Error(`Duplicate post slugs found in content/post-sync.json.\n${details}`)
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Obsidian source directory does not exist: ${sourceDir}`)
  }

  const config = JSON.parse(readUtf8(configPath))
  assertNoDuplicateSlugs(config)

  const sourceFiles = getSourceFiles()
  assertNoDuplicateSourceFilenames(sourceFiles)

  const sourceNames = new Set(sourceFiles.map((file) => file.filename))
  const mappedFiles = new Set(Object.keys(config))
  const stats = { created: 0, updated: 0, skipped: 0, missing: 0 }

  fs.mkdirSync(outputDir, { recursive: true })

  for (const { filename, sourcePath, inferredMeta } of sourceFiles) {
    const configMeta = config[filename]
    if (!configMeta) {
      console.log(`Skipped unmapped: ${filename}`)
      stats.skipped += 1
      continue
    }

    const meta = mergeMeta(filename, configMeta, inferredMeta)
    const outputPath = path.join(outputDir, `${meta.slug}.mdx`)
    const nextContent = renderMdx(filename, readUtf8(sourcePath), meta)
    const previousContent = fs.existsSync(outputPath) ? readUtf8(outputPath) : null

    if (previousContent === nextContent) {
      console.log(`Unchanged: ${meta.slug}.mdx`)
      continue
    }

    fs.writeFileSync(outputPath, nextContent, 'utf8')
    if (previousContent == null) {
      console.log(`Created: ${meta.slug}.mdx`)
      stats.created += 1
    } else {
      console.log(`Updated: ${meta.slug}.mdx`)
      stats.updated += 1
    }
  }

  for (const filename of mappedFiles) {
    if (!sourceNames.has(filename)) {
      console.log(`Missing source: ${filename}`)
      stats.missing += 1
    }
  }

  console.log(
    `Done. created=${stats.created}, updated=${stats.updated}, skipped=${stats.skipped}, missing=${stats.missing}`,
  )
}

main()
