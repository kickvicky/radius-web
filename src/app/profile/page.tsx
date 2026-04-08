import { Header, BottomNavigation } from "@/components/layout";
import { Shield, MapPin, MessageCircle, ChevronUp, Settings } from "lucide-react";

const userStats = {
  username: "Phantom-Coder-42",
  joinedAgo: "3 months ago",
  postsCount: 28,
  upvotesReceived: 342,
  commentsCount: 89,
  currentLocation: "Indiranagar, Bengaluru",
};

export default function Profile() {
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
            <div className="w-16 h-16 rounded-[16px] bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{userStats.username}</h2>
              <p className="text-xs text-on-surface-variant">Joined {userStats.joinedAgo}</p>
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
