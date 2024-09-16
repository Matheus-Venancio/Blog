export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  article: string;
  pubDate: number;
  lastEdited: number;
  coverUrl: string;
  isDraft: boolean;
}
