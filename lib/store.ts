import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Feed, Article, FeedFilters } from './types';


interface AppState {
  feeds: Feed[];
  articles: Article[];
  filters: FeedFilters;
  addFeed: (feed: Feed) => void;
  removeFeed: (id: string) => void;
  updateFeedLastFetched: (id: string) => void;
  addArticles: (articles: Article[]) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  clearArticlesForFeed: (feedId: string) => void;
  updateFilters: (filters: FeedFilters) => void;
}


export const useStore = create<AppState>()(
  persist(
    set => ({
      feeds: [],
      articles: [],
      filters: {
        keywords: [],
        categories: [],
        minRelevanceScore: 0,
      },
      addFeed: feed =>
        set(state => ({
          feeds: [...state.feeds, feed],
        })),
      removeFeed: id =>
        set(state => ({
          feeds: state.feeds.filter(feed => feed.id !== id),
          articles: state.articles.filter(article => article.feedId !== id),
        })),
      updateFeedLastFetched: id =>
        set(state => ({
          feeds: state.feeds.map(feed =>
            feed.id === id
              ? { ...feed, lastFetched: new Date().toISOString() }
              : feed
          ),
        })),
      addArticles: newArticles =>
        set(state => ({
          articles: [...newArticles, ...state.articles],
        })),
      updateArticle: (id, updates) =>
        set(state => ({
          articles: state.articles.map(article =>
            article.id === id ? { ...article, ...updates } : article
          ),
        })),
      clearArticlesForFeed: feedId =>
        set(state => ({
          articles: state.articles.filter(article => article.feedId !== feedId),
        })),
      updateFilters: filters => set({ filters }),
    }),
    {
      name: 'content-automation-storage',
    }
  )
);
