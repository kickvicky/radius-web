"use client";

import { ChevronUp, ChevronDown, MessageCircle, Share2 } from "lucide-react";
import { VoteType } from "@/types/feed";

interface InteractionBarProps {
  votes: { up: number; down: number };
  userVote: VoteType;
  comments: number;
  onVote: (type: "up" | "down") => void;
  onComment?: () => void;
  onShare?: () => void;
}

export function InteractionBar({
  votes,
  userVote,
  comments,
  onVote,
  onComment,
  onShare,
}: InteractionBarProps) {
  return (
    <div className="flex items-center gap-1 pt-1">
      <div className="flex items-center bg-surface-container-high/60 rounded-[10px] overflow-hidden">
        <button
          onClick={() => onVote("up")}
          className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${
            userVote === "up"
              ? "text-primary bg-primary/10"
              : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
          }`}
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-xs font-medium">{votes.up}</span>
        </button>
        <div className="w-px h-5 bg-outline-variant/30" />
        <button
          onClick={() => onVote("down")}
          className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${
            userVote === "down"
              ? "text-error bg-error/10"
              : "text-on-surface-variant hover:text-error hover:bg-error/5"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
          <span className="text-xs font-medium">{votes.down}</span>
        </button>
      </div>

      <button
        onClick={onComment}
        className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-xs font-medium">{comments}</span>
      </button>

      <button
        onClick={onShare}
        className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors ml-auto"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
