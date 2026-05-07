export interface NewsProviderArticle {
  externalId: string
  title: string
  summary: string | null
  sourceName: string | null
  sourceUrl: string | null
  publishedAt: Date
}

export interface NewsProvider {
  fetch(query: {
    keywords?: string | null
    language?: string | null
    sources?: string | null
    domains?: string | null
    categoryMode?: "include" | "exclude" | null
    categories?: string | null
  }): Promise<NewsProviderArticle[]>
}
