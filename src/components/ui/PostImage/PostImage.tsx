"use client";

import { useState } from "react";

interface PostImageProps {
  src: string;
  alt: string;
}

function getCloudinaryOptimizedUrl(url: string, width: number): string {
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
}

export function PostImage({ src, alt }: PostImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  const optimizedSrc = getCloudinaryOptimizedUrl(src, 800);

  return (
    <div className="relative w-full aspect-[16/10] rounded-[10px] overflow-hidden bg-surface-container-high">
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-surface-container-highest" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
