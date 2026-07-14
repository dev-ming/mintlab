# Mintlab

AI tools, developer workflows, debugging notes, and small technical guides.

Site: [mintlab-nu.vercel.app](https://mintlab-nu.vercel.app/)

## Stack

- Next.js 14 App Router
- Tailwind CSS
- MDX with `next-mdx-remote`
- Bun
- Vercel

## Local Development

```bash
bun install
bun run dev
```

Build check:

```bash
bun run build
```

## Post Workflow

Obsidian is the source of truth for posts.

Default source directory:

```text
C:\Users\jenna\jenna-coding\Obsidian\Archive
```

Write posts in the matching category folder:

```text
Archive\
  guide\
  ai\
    guide\
    concepts\
  review\
  log\
```

The folder decides the post category:

```text
Archive\guide\*.md       -> category: "guide"
Archive\review\*.md      -> category: "review"
Archive\log\*.md         -> category: "log"
Archive\ai\guide\*.md    -> category: "ai", subcategory: "guide"
Archive\ai\concepts\*.md -> category: "ai", subcategory: "concepts"
```

## Publishing A Post

Add the post metadata to `content/post-sync.json`:

```json
{
  "Example Post.md": {
    "slug": "example-post",
    "tags": ["nextjs", "debugging"],
    "excerpt": "Short summary shown in lists and metadata."
  }
}
```

Then sync:

```bash
bun run sync:posts
```

The sync script writes generated MDX files to:

```text
content/posts/
```

Before pushing:

```bash
bun run sync:posts
bun run build
```

## Sync Rules

- File names in `Archive` must be unique.
- Slugs in `content/post-sync.json` must be unique.
- `**bold**` markers are stripped from synced post bodies outside code blocks.
- If a post has no `> 작성일: YYYY-MM-DD` line, add `date` in `content/post-sync.json`.
- Obsidian wiki links should be converted to normal markdown links before publishing.

Example:

```md
[토큰 인증 — Access vs Refresh](/posts/access-token-refresh-token-auth-guide)
```

## Embeds

Put static HTML embeds in:

```text
public/embeds/
```

Use them in MDX with:

```mdx
<EmbedViewer src="/embeds/example.html" />
```
