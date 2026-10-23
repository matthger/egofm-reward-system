/**
 * Interface for a news item on the home page.
 */
export interface NewsItem {
  image: string;
  title: string;
  date: string;
  description: string;
  likes: number;
  liked: boolean;
  saved: boolean;
}
