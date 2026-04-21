"use client";

// `ssr: false` is only valid inside a Client Component.
// CreatePostForm uses useGeolocation (navigator API) which produces different
// output on server vs client — opting out of SSR eliminates the mismatch.
import dynamic from "next/dynamic";

export const CreatePostFormDynamic = dynamic(
  () => import("./CreatePostForm").then((m) => m.CreatePostForm),
  {
    ssr: false,
    // Minimal skeleton that matches the form's rough height while JS loads
    loading: () => (
      <div className="space-y-4 animate-pulse">
        <div className="bg-surface-container rounded-[12px] p-4 h-[172px]" />
        <div className="bg-surface-container rounded-[12px] p-4 h-[72px]" />
        <div className="bg-surface-container rounded-[12px] h-11" />
        <div className="bg-primary/20 rounded-[12px] h-12" />
      </div>
    ),
  }
);
