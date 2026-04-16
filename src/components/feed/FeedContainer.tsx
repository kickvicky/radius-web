"use client";

import { useFeedPosts } from "@/hooks/useFeedPosts";
import { FeedList } from "./FeedList";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container rounded-[12px] p-4 space-y-3 animate-pulse"
        >
          {/* Header row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-surface-container-highest" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-32 rounded bg-surface-container-highest" />
              <div className="h-2 w-20 rounded bg-surface-container-highest" />
            </div>
          </div>
          {/* Content lines */}
          <div className="space-y-2">
            <div className="h-3 rounded bg-surface-container-highest" />
            <div className="h-3 w-4/5 rounded bg-surface-container-highest" />
          </div>
          {/* Image placeholder */}
          <div className="h-44 rounded-[10px] bg-surface-container-highest" />
          {/* Interaction bar */}
          <div className="h-8 w-48 rounded bg-surface-container-highest" />
        </div>
      ))}
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function FeedError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
        <span className="text-xl">⚠️</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-on-surface">Could not load posts</p>
        <p className="text-xs text-on-surface-variant max-w-[240px]">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-[8px] bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function FeedEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
        <span className="text-xl">📭</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-on-surface">Nothing here yet</p>
        <p className="text-xs text-on-surface-variant">Be the first to post in your area!</p>
      </div>
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────
export function FeedContainer() {
  const { data: posts, isLoading, isError, error, refetch } = useFeedPosts();

  if (isLoading) return <FeedSkeleton />;

  if (isError) {
    return (
      <FeedError
        message={error?.message ?? "Something went wrong. Please try again."}
        onRetry={refetch}
      />
    );
  }

  if (!posts || posts.length === 0) return <FeedEmpty />;

  return <FeedList posts={posts} />;
}
