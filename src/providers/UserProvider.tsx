"use client";

import { createContext, use, useContext } from "react";
import type { AuthUser } from "@/lib/auth";

/**
 * Context that carries the *promise* of the current user from a Server
 * Component boundary down into Client Components.
 *
 * Storing the promise (instead of the resolved value) lets us:
 *   - Render the server-rendered tree instantly without blocking on auth.
 *   - Let consumers opt-in to reading the user via `use(promise)` inside
 *     a `<Suspense>` boundary, so individual pieces of UI can have their
 *     own loading fallbacks if needed.
 *
 * This is the Next.js 16 recommended pattern for sharing request-scoped
 * data between Server and Client Components — see
 * node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md
 * ("Sharing data with context and React.cache").
 */
const UserContext = createContext<Promise<AuthUser | null> | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
  /**
   * Unawaited promise produced by `getCurrentUser()` in a Server Component.
   * Pass it in WITHOUT awaiting so React can stream.
   */
  userPromise: Promise<AuthUser | null>;
}

export function UserProvider({ children, userPromise }: UserProviderProps) {
  return (
    <UserContext.Provider value={userPromise}>{children}</UserContext.Provider>
  );
}

/**
 * Read the current user in a Client Component.
 *
 * MUST be called from a component rendered inside a `<Suspense>` boundary,
 * because `use()` will suspend until the promise resolves. Returns `null`
 * when the viewer is not authenticated.
 *
 * For Server Components, import `getCurrentUser` from `@/lib/auth` directly
 * instead — it shares the same cached promise.
 */
export function useUser(): AuthUser | null {
  const userPromise = useContext(UserContext);
  if (!userPromise) {
    throw new Error("useUser must be used within a <UserProvider>");
  }
  return use(userPromise);
}
