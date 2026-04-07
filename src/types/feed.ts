export interface FeedPost {
  id: string;
  username: string;
  timeAgo: string;
  distance: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  isVerified?: boolean;
  tag?: FeedTag;
  imageUrl?: string;
}

export type FeedTag = "LOCAL" | "HAPPENING NOW" | "ALERT" | "TRENDING" | "CAUTION";

export type VoteType = "up" | "down" | null;
