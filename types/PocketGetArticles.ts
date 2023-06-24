import { type PocketArticleMetadata } from './PocketArticleMetadata'

export type PocketList = Record<string, PocketArticleMetadata>

export interface PocketGetArticles {
  status: 1 | 0
  complete: 1 | 0
  list: Record<string, PocketArticleMetadata>
  error: unknown
  search_meta: SearchMeta
  since: number
}

export interface SearchMeta {
  search_type: string
}
