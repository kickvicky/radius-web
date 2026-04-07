import { FeedPost } from "@/types/feed";
import { FeedCard } from "./FeedCard";

interface FeedListProps {
  posts: FeedPost[];
}

export function FeedList({ posts }: FeedListProps) {
  return (
    <div className="y">
      {posts.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}
    </div>
  );
}
