# Mintlab

**AI 워크플로우, 도구 리뷰, 프롬프트 템플릿을 직접 만들고 기록하는 아카이브**

🔗 **[mintlab-nu.vercel.app](https://mintlab-nu.vercel.app/)**

---

## 소개

Mintlab은 AI 도구와 워크플로우를 실제로 써보고 기록하는 개인 아카이브입니다.

- **가이드** — Claude Code, LLM 활용 패턴, 자동화 워크플로우
- **도구 리뷰** — AI 도구 실사용 후기와 비교
- **프롬프트** — 실전에서 검증된 프롬프트 템플릿

## 기술 스택

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/) + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- [MDX](https://mdxjs.com/) (next-mdx-remote, remark-gfm, rehype-pretty-code)
- [Bun](https://bun.sh/)
- [Vercel](https://vercel.com/)

## 로컬 실행

```bash
bun install
bun run dev
```

## 새 포스트 작성

`content/posts/` 폴더에 `.mdx` 파일 추가:

```mdx
---
title: "포스트 제목"
date: "2026-06-11"
tags: ["workflow", "llm"]
category: "guide"   # guide | tool | prompt | showcase
excerpt: "한 줄 요약"
---

본문 내용
```

HTML 결과물 임베드는 `public/embeds/`에 파일을 넣고 MDX에서 `<EmbedViewer src="/embeds/파일명.html" />` 사용.
