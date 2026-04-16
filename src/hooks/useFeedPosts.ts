import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/api/posts";
import { FeedPost } from "@/types/feed";

export const FEED_POSTS_QUERY_KEY = ["feed", "posts"] as const;

export function useFeedPosts() {
  return useQuery<FeedPost[], Error>({
    queryKey: FEED_POSTS_QUERY_KEY,
    queryFn: fetchPosts,
  });
}
