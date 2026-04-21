// ─── UI Model ────────────────────────────────────────────────────────────────
export interface FeedPost {
  id: string;
  username: string;
  timeAgo: string;
  distance?: string;
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

// ─── Create Post ─────────────────────────────────────────────────────────────
export interface CreatePostPayload {
  content: string;
  imageUrl?: string;
  tag?: FeedTag;
  latitude: number;
  longitude: number;
}

// ─── API Response Model ───────────────────────────────────────────────────────
export interface ApiPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  imageUrl?: string | null;
  tag?: string | null;
  latitude: number;
  longitude: number;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  isVerified: boolean;
  createdAt: string; // ISO 8601 — e.g. "2026-04-16T10:30:00"
}
