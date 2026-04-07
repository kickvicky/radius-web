"use client";

import { useState } from "react";

type FilterType = "latest" | "trending";

interface FeedHeaderProps {
  title?: string;
  onFilterChange?: (filter: FilterType) => void;
}

export function FeedHeader({ title = "The Pulse", onFilterChange }: FeedHeaderProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("latest");

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleFilterChange("latest")}
          className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors ${
            activeFilter === "latest"
              ? "bg-primary/10 text-primary"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => handleFilterChange("trending")}
          className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors ${
            activeFilter === "trending"
              ? "bg-primary/10 text-primary"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          Trending
        </button>
      </div>
    </div>
  );
}
