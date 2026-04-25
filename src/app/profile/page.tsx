import { Header, BottomNavigation } from "@/components/layout";
import { MapPin, MessageCircle, ChevronUp, Settings } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getAvatarDataUrl } from "@/lib/avatar";

// NOTE: these are still placeholders — they should come from a stats endpoint
// once the backend exposes one. Only identity fields are currently real.
const userStats = {
  joinedAgo: "3 months ago",
  postsCount: 28,
  upvotesReceived: 342,
  commentsCount: 89,
  currentLocation: "Indiranagar, Bengaluru",
};

export default async function Profile() {
  // This route is already gated by the proxy (src/proxy.ts), so `user` will
  // almost always be non-null here. We still defend against the edge case
  // where the Gateway hiccups between proxy and render.
  const user = await getCurrentUser();
  const displayHandle = user?.username ?? "anonymous";
  const displayName = user?.name?.trim() || displayHandle;
  // Use the pre-resolved data URL from `getCurrentUser()` when we have a real
  // user. The "anonymous" fallback path is rare (Gateway hiccup); resolve its
  // avatar inline — `getAvatarDataUrl()` reuses the module-level cache so
  // subsequent visits are free.
  const avatarSrc = user?.avatarDataUrl ?? (await getAvatarDataUrl(displayHandle));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-6 pb-28">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold tracking-tight">Profile</h1>
          <button className="w-10 h-10 rounded-[12px] bg-surface-container flex items-center justify-center">
            <Settings className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="bg-surface-container rounded-[12px] p-5 mb-4">
          <div className="flex items-center gap-4 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={`Avatar for @${displayHandle}`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-[16px] bg-gradient-to-br from-primary/20 to-primary/5 shrink-0"
            />
            <div className="min-w-0 space-y-0.5">
              <h2 className="font-semibold text-lg truncate">{displayName}</h2>
              <p className="text-xs text-on-surface-variant truncate">
                @{displayHandle}
              </p>
              <p className="text-xs text-on-surface-variant/70">
                Joined {userStats.joinedAgo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{userStats.currentLocation}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-surface-container rounded-[12px] p-4 text-center">
            <span className="block text-2xl font-bold text-primary">{userStats.postsCount}</span>
            <span className="text-xs text-on-surface-variant">Posts</span>
          </div>
          <div className="bg-surface-container rounded-[12px] p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <ChevronUp className="w-4 h-4 text-primary" />
              <span className="text-2xl font-bold text-primary">{userStats.upvotesReceived}</span>
            </div>
            <span className="text-xs text-on-surface-variant">Upvotes</span>
          </div>
          <div className="bg-surface-container rounded-[12px] p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-2xl font-bold text-primary">{userStats.commentsCount}</span>
            </div>
            <span className="text-xs text-on-surface-variant">Comments</span>
          </div>
        </div>

        <div className="bg-surface-container rounded-[12px] p-4">
          <h3 className="font-medium text-sm mb-3">Your Identity</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Your identity is protected. Other users only see your anonymous handle. 
            Location data is approximated to protect your privacy.
          </p>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
