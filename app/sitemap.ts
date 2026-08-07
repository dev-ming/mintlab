import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/content'
import { SITE_CONFIG } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const latestPostDate = posts[0]?.date ? new Date(posts[0].date) : new Date()
  const staticRoutes = ['', '/posts', '/guide', '/ai', '/reviews', '/logs']

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_CONFIG.url}${route}`,
      lastModified: latestPostDate,
      changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${SITE_CONFIG.url}/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
