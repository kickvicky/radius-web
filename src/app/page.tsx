import Link from "next/link";
import { Radar, ArrowRight } from "lucide-react";
import { getCurrentUser, GATEWAY_LOGIN_URL } from "@/lib/auth";

export default async function Home() {
  // `getCurrentUser()` is wrapped in React.cache, so this is the same
  // request-scoped fetch used by the layout + Header. When the cookie is
  // missing we return null without a network call, so the logged-out path
  // stays free.
  const user = await getCurrentUser();
  const isLoggedIn = user !== null;
  // Use first name only for a friendlier greeting; fall back to the handle
  // if the Gateway didn't return a display name.
  const firstName = user?.name?.trim().split(/\s+/)[0] || user?.username || "";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-[20vh] px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          {isLoggedIn ? (
            // Signed-in: render the user's deterministic DiceBear avatar.
            // The data URL is pre-resolved and cached on the server inside
            // `getCurrentUser()`, so this `<img>` paints from inline HTML
            // with no client-side network call.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user!.avatarDataUrl}
              alt={`Avatar for @${user!.username}`}
              width={80}
              height={80}
              className="w-20 h-20 rounded-[16px] bg-gradient-to-br from-primary/20 to-primary/5 mx-auto shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-[16px] bg-primary/10 flex items-center justify-center mx-auto">
              <Radar className="w-10 h-10 text-primary" />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoggedIn ? (
              <>
                Welcome back{firstName ? `, ${firstName}` : ""} to{" "}
                <span className="text-primary">Radius</span>
              </>
            ) : (
              <>
                Welcome to <span className="text-primary">Radius</span>
              </>
            )}
          </h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Discover what&apos;s happening around you. Connect with your local community in real-time.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/pulse"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-[12px] bg-gradient-to-r from-primary to-primary/80 text-surface font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                Enter The Pulse
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-on-surface-variant/60">
                You&apos;re signed in. Jump right back in.
              </p>
            </>
          ) : (
            <>
              <a
                href={GATEWAY_LOGIN_URL}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-[12px] bg-surface-container border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors shadow-sm"
              >
                {/* Google "G" logo */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-5 h-5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.15 0 5.64 1.08 7.55 2.84l5.62-5.62C33.88 3.54 29.34 1.5 24 1.5 14.92 1.5 7.28 7.1 4.14 15.02l6.54 5.08C12.28 14.04 17.68 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24c0-1.64-.15-3.22-.42-4.75H24v9h12.71C35.88 32.1 33.2 34.6 29.7 36.2l6.42 4.98C41.8 37.1 46.5 31.07 46.5 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.68 28.1A14.5 14.5 0 0 1 9.5 24c0-1.43.2-2.82.58-4.1L3.54 14.82A22.44 22.44 0 0 0 1.5 24c0 3.6.86 7 2.38 10.01l6.8-5.91z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 46.5c5.34 0 9.82-1.76 13.1-4.78l-6.42-4.98c-1.78 1.19-4.06 1.9-6.68 1.9-6.32 0-11.72-4.54-13.32-10.61l-6.8 5.91C7.28 40.9 14.92 46.5 24 46.5z"
                  />
                </svg>
                Login with Google
              </a>
              <p className="text-xs text-on-surface-variant/60">
                Sign in to explore your local Radius.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
