import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/api/posts";
import { FeedPost } from "@/types/feed";
import { useGeolocation } from "@/hooks/useGeolocation";

export const FEED_POSTS_QUERY_KEY = ["feed", "posts"] as const;

export function useFeedPosts() {
  const { lat, lng, loading: locationLoading } = useGeolocation();

  const hasCoords = lat !== null && lng !== null;

  return useQuery<FeedPost[], Error>({
    // Include coords in the key so the query re-runs when location resolves
    queryKey: [...FEED_POSTS_QUERY_KEY, { lat, lng }],
    queryFn: () => fetchPosts(hasCoords ? { lat: lat!, lng: lng! } : undefined),
    // Wait until the geolocation attempt has settled before fetching
    enabled: !locationLoading,
  });
}
