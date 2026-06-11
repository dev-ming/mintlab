# Mintlab — Next.js 프로젝트 셋업 가이드

## 1. 프로젝트 생성

```bash
npx create-next-app@latest mintlab \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd mintlab
```

## 2. 필수 패키지 설치

```bash
npm install next-mdx-remote gray-matter
npm install rehype-pretty-code shiki
npm install fuse.js
npm install lucide-react
npm install @tailwindcss/typography
```

## 3. 파일 배치

아래 파일들을 각 경로에 복사하세요:

```
app/
  layout.tsx          ← 루트 레이아웃 + 네비게이션
  page.tsx            ← 홈 피드
  globals.css         ← 글로벌 스타일
  posts/
    page.tsx          ← 전체 포스트 목록
    [slug]/
      page.tsx        ← 포스트 상세 (MDX 렌더)
  tools/
    page.tsx          ← 도구 리뷰 목록
  prompts/
    page.tsx          ← 프롬프트 템플릿
components/
  EmbedViewer.tsx     ← HTML 결과물 iframe 임베드
  PostCard.tsx        ← 포스트 카드
  TagFilter.tsx       ← 태그 필터
  SearchBar.tsx       ← 퓨지 서치
lib/
  content.ts          ← MDX 파싱 + 메타데이터 유틸
content/
  posts/
    llm-wiki-guide.mdx  ← 예시 포스트
```

## 4. tailwind.config.ts 수정

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
}
export default config
```

## 5. Vercel 배포

```bash
# Vercel CLI 설치 (처음 한 번)
npm i -g vercel

# 배포
vercel
# → 프로젝트 이름, 팀 선택 후 자동 배포
# → 이후 git push origin main 하면 자동 재배포
```

## 6. 새 포스트 추가 방법

`content/posts/` 폴더에 `.mdx` 파일 생성:

```mdx
---
title: "내 포스트 제목"
date: "2026-06-10"
tags: ["workflow", "llm", "obsidian"]
category: "guide"        # guide | tool | prompt | showcase
excerpt: "한 줄 요약"
embedUrl: "/embeds/my-tool.html"   # 결과물 임베드 (선택)
---

# 본문 내용

<EmbedViewer src="/embeds/my-tool.html" height={600} />
```

HTML 결과물은 `public/embeds/` 폴더에 넣으면 자동으로 임베드됩니다.
