import { ImageResponse } from 'next/og'
import { SITE_CONFIG } from '@/lib/site'

export const runtime = 'edge'
export const alt = 'Mintlab 개발 기록 아카이브'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          color: '#e2e8f0',
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 55%, #064e3b 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 28, color: '#6ee7b7' }}>
          <div style={{ width: 18, height: 18, borderRadius: 99, background: '#34d399' }} />
          Developer Archive
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: '-4px' }}>{SITE_CONFIG.name}</div>
          <div style={{ maxWidth: 920, fontSize: 34, lineHeight: 1.35, color: '#cbd5e1' }}>
            Next.js · AI 자동화 · 프론트엔드 문제 해결 기록
          </div>
        </div>
        <div style={{ fontSize: 24, color: '#94a3b8' }}>{SITE_CONFIG.url.replace('https://', '')}</div>
      </div>
    ),
    size,
  )
}
