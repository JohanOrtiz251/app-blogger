export interface Article {
  id: string;
  title: string;
  content: string;
  source: string;
  feedId: string;
  imageUrl?: string;
  status: 'pendiente' | 'procesando' | 'listo' | 'publicando' | 'publicado'; // Agregamos "publicando"
  originalContent?: string;
  publishedUrl?: string;
  publishedDate?: string;
  socialContent?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  keywords?: string[];
  category?: string;
  relevanceScore?: number;
}

export interface FeedFilters {
  keywords: string[];
  categories: string[];
  minRelevanceScore: number;
}
