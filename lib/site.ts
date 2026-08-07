import type { Metadata } from 'next'

export const SITE_CONFIG = {
  name: 'Mintlab',
  url: 'https://mintlab-nu.vercel.app',
  description: 'Next.js, AI 자동화, 프론트엔드 문제 해결 과정을 기록하는 개발 아카이브',
  author: 'dev-ming',
} as const

export function createPageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: path,
      siteName: SITE_CONFIG.name,
      title,
      description,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  }
}
