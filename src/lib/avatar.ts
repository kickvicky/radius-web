import "server-only";

/**
 * Avatar URL helpers for the anonymous-handle UI.
 *
 * We render robot-style avatars from DiceBear's `bottts` collection, seeded by
 * the user's handle so the same handle always gets the same avatar across
 * devices and sessions — no server-side state required.
 *
 * Two functions live here:
 *
 *   - `avatarUrlFor(seed)`     → the raw DiceBear URL. Cheap, sync, safe to
 *                                call from client code. Useful as a fallback
 *                                when we don't (or can't) pre-fetch.
 *
 *   - `getAvatarDataUrl(seed)` → fetches the SVG once, base64-encodes it as a
 *                                `data:` URL, and memoises the result in a
 *                                module-level Map. Subsequent calls for the
 *                                same seed (across requests, for the lifetime
 *                                of this Node process) are O(1) lookups with
 *                                zero network I/O. Avatars are deterministic
 *                                per seed, so caching forever is safe.
 *
 * The data URL approach means the SVG is inlined into the HTML payload — the
 * browser never has to make a separate request to api.dicebear.com to render
 * the avatar, which both removes a runtime dependency and avoids CORS quirks.
 */

/**
 * Cross-request cache. Lives for the lifetime of the Node worker process.
 *
 * Keyed by the raw seed (i.e. the username). DiceBear renders are pure
 * functions of the seed, so cache entries are valid forever — no TTL needed.
 *
 * NOTE: This is a per-process cache. Horizontally scaled deployments will
 * have one cache per instance, which is fine — the worst case is one fetch
 * per username per instance per restart.
 */
const avatarDataUrlCache = new Map<string, string>();

/**
 * Synchronous DiceBear URL. Use this in client code, or as a fallback when
 * the SVG fetch fails (e.g. DiceBear is unreachable). The browser will fall
 * back to fetching the URL itself.
 */
export function avatarUrlFor(seed: string): string {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * Server-only: fetch the avatar SVG once and cache it as a base64 data URL.
 *
 * The first call for a given seed makes a single HTTPS request to DiceBear,
 * converts the SVG into `data:image/svg+xml;base64,…`, and stores it in the
 * module-level cache. Every subsequent call (for the same seed, in the same
 * Node process) returns the cached string immediately.
 *
 * If the fetch fails for any reason we fall back to the plain DiceBear URL
 * and intentionally do NOT cache the fallback — next request can retry.
 */
export async function getAvatarDataUrl(seed: string): Promise<string> {
  const cached = avatarDataUrlCache.get(seed);
  if (cached) return cached;

  const url = avatarUrlFor(seed);

  try {
    // `force-cache` lets Next.js's data cache help us across cold starts too,
    // but our in-process Map is the primary line of defence.
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return url;

    const svg = await res.text();
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

    avatarDataUrlCache.set(seed, dataUrl);
    return dataUrl;
  } catch (error) {
    console.warn("[avatar] Failed to fetch DiceBear SVG, falling back to URL:", error);
    return url;
  }
}
