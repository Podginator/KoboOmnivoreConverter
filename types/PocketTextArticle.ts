export interface PocketArticleDownload {
  resolved_id: string
  resolvedUrl: string
  host: string
  title: string
  datePublished: Date
  timePublished: number
  responseCode: number
  excerpt: string
  authors: string
  images: string
  videos: string
  wordCount: number
  isArticle: number
  isVideo: number
  isIndex: number
  usedFallback: number
  requiresLogin: number
  lang: string
  topImageUrl: string
  article: string
}
