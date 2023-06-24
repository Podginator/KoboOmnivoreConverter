
export interface PocketArticleMetadata {
  item_id: string
  resolved_id: string
  given_url: string
  given_title: string
  favorite: string
  status: string
  time_added: string
  time_updated: string
  time_read: string
  time_favorited: string
  sort_id: number
  resolved_title: string
  resolved_url: string
  excerpt: string
  is_article: string
  is_index: string
  has_video: string
  has_image: string
  word_count: string
  lang: string
  time_to_read: number
  top_image_url: string
  authors: Authors
  image: Image
  images: Images
  domain_metadata: DomainMetadata
  listen_duration_estimate: number
}

export type Authors = Record<string, Partial<{ 'item_id': string, 'author_id': string, 'name': string, 'url': string }>>

export interface The156739773 {
  item_id: string
  author_id: string
  name: string
  url: string
}

export interface DomainMetadata {
  name: string
  logo: string
  greyscale_logo: string
}

export interface Image {
  item_id: string
  image_id: string
  src: string
  width: string
  height: string
  credit: string
  caption: string
}

export type Images = Record<string, Image>
