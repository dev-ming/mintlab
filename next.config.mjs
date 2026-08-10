import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

/** @type {import('next').NextConfig} */
const baseConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
}

export default function nextConfig(phase) {
  return {
    ...baseConfig,
    // Keep local HMR output separate from production builds. Sharing `.next`
    // can leave the dev HTML pointing at CSS chunks replaced by `next build`.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  }
}
