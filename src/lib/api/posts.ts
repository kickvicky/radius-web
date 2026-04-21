import { ApiPost, CreatePostPayload, FeedPost, FeedTag } from "@/types/feed";

// ─── Relative time formatter ──────────────────────────────────────────────────
function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// ─── API → UI adapter ─────────────────────────────────────────────────────────
function adaptApiPost(post: ApiPost): FeedPost {
  return {
    id: post.id,
    username: post.userName,
    timeAgo: formatRelativeTime(post.createdAt),
    content: post.content,
    imageUrl: post.imageUrl ?? undefined,
    tag: (post.tag as FeedTag) ?? undefined,
    upvotes: post.upvoteCount,
    downvotes: post.downvoteCount,
    comments: post.commentCount,
    isVerified: post.isVerified,
  };
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
export interface FetchPostsParams {
  lat?: number;
  lng?: number;
}

export async function fetchPosts(params?: FetchPostsParams): Promise<FeedPost[]> {
  const url = new URL("/api/posts", window.location.origin);

  if (params?.lat !== undefined) url.searchParams.set("lat", String(params.lat));
  if (params?.lng !== undefined) url.searchParams.set("lng", String(params.lng));

  const res = await fetch(url.toString(), {
    // no-store keeps the feed fresh on every re-fetch in dev
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error?.errorMessage ?? `Failed to fetch posts (${res.status})`
    );
  }

  const data: ApiPost[] = await res.json();
  return data.map(adaptApiPost);
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createPost(payload: CreatePostPayload): Promise<ApiPost> {
  const res = await fetch("/api/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error?.errorMessage ?? `Failed to create post (${res.status})`
    );
  }

  return res.json();
}
