/**
 * Authentication constants and helpers shared by the proxy and Server Components.
 *
 * The Spring Boot Gateway is configured to issue a session cookie named
 * `RADIUS_SESSION` (see `server.servlet.session.cookie.name` in the gateway's
 * application.yml). The cookie is HttpOnly + SameSite=Lax and is created after
 * a successful Google OAuth2 login at the Gateway (localhost:8080).
 *
 * Keep this value in sync with the Gateway config — this is the single source
 * of truth on the web side.
 */
export const SESSION_COOKIE_NAME = "RADIUS_SESSION";

/**
 * The Gateway URL that kicks off the Google OAuth2 authorization flow.
 * A full browser navigation to this URL is required (not a client-side
 * navigation) so Spring Security can handle the redirect chain end-to-end.
 */
export const GATEWAY_LOGIN_URL =
  "http://localhost:8080/oauth2/authorization/google";

/**
 * The Gateway endpoint used by the proxy to validate an existing session.
 * Expected contract:
 *   - 2xx  → session is valid
 *   - 401  → session is missing / expired / invalid
 *   - 5xx / network error → Gateway issue (callers decide how to react)
 */
export const GATEWAY_AUTH_STATUS_URL =
  "http://localhost:8080/api/auth/status";

/**
 * Asks the Gateway whether the supplied cookie header represents a currently
 * authenticated session.
 *
 * @returns
 *   - `true`  → Gateway confirmed the session is valid (2xx)
 *   - `false` → Gateway definitively rejected (401 / 403, or no cookie)
 *
 * @throws Propagates network errors and 5xx responses. Callers decide whether
 *         to fail-open (proxy) or fall back to a heuristic (home page UI).
 *
 * Forwarding the raw cookie header (rather than rebuilding it from a parsed
 * cookie jar) avoids escaping bugs and ensures the Gateway sees the request
 * exactly as the browser sent it.
 */
export async function checkSessionValid(
  cookieHeader: string
): Promise<boolean> {
  if (!cookieHeader) return false;

  const res = await fetch(GATEWAY_AUTH_STATUS_URL, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) return false;
  if (res.ok) return true;

  // 5xx or other non-2xx → let the caller decide.
  throw new Error(`Auth status returned ${res.status}`);
}
