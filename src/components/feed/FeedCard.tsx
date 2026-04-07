"use client";

import { useState } from "react";
import { FeedPost, FeedTag, VoteType } from "@/types/feed";
import { InteractionBar, PostImage } from "@/components/ui";

interface FeedCardProps {
  post: FeedPost;
}

function getTagStyle(tag: FeedTag): string {
  switch (tag) {
    case "ALERT":
      return "bg-secondary-container/20 text-secondary-container";
    case "TRENDING":
      return "bg-primary/15 text-primary";
    case "HAPPENING NOW":
      return "bg-primary/10 text-primary";
    case "LOCAL":
      return "bg-surface-container-highest text-on-surface-variant";
    case "CAUTION":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-surface-container-highest text-on-surface-variant";
  }
}

export function FeedCard({ post }: FeedCardProps) {
  const [votes, setVotes] = useState({ up: post.upvotes, down: post.downvotes });
  const [userVote, setUserVote] = useState<VoteType>(null);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      setUserVote(null);
      setVotes((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }));
    } else {
      if (userVote) {
        setVotes((prev) => ({
          up: userVote === "up" ? prev.up - 1 : type === "up" ? prev.up + 1 : prev.up,
          down: userVote === "down" ? prev.down - 1 : type === "down" ? prev.down + 1 : prev.down,
        }));
      } else {
        setVotes((prev) => ({
          ...prev,
          [type]: prev[type] + 1,
        }));
      }
      setUserVote(type);
    }
  };

  return (
    <article className="bg-surface-container rounded-[12px] p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {post.username.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{post.username}</span>
              {post.isVerified && (
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span>{post.timeAgo}</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full" />
              <span>{post.distance}</span>
            </div>
          </div>
        </div>
        {post.tag && (
          <span
            className={`text-[10px] font-semibold tracking-wider px-2 py-1 rounded-[6px] ${getTagStyle(post.tag)}`}
          >
            {post.tag}
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-on-surface/90">{post.content}</p>

      {post.imageUrl && (
        <PostImage src={post.imageUrl} alt={`Post by ${post.username}`} />
      )}

      <InteractionBar
        votes={votes}
        userVote={userVote}
        comments={post.comments}
        onVote={handleVote}
      />
    </article>
  );
}
