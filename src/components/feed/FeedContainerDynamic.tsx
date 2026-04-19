"use client";

// `ssr: false` is only allowed inside Client Components.
// This thin wrapper lets the Server Component page use it without
// converting the entire page to a client boundary.
import dynamic from "next/dynamic";
import { FeedSkeleton } from "./FeedContainer";

export const FeedContainerDynamic = dynamic(
  () => import("./FeedContainer").then((m) => m.FeedContainer),
  { ssr: false, loading: () => <FeedSkeleton /> }
);
