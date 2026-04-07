import { Header, LocationBanner, BottomNavigation } from "@/components/layout";
import { FeedList, FeedHeader } from "@/components/feed";
import { mockFeedData } from "@/data/mock-feed";

export default function PulseFeed() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LocationBanner location="Indiranagar, Bengaluru" />

      <main className="px-4 py-4 pb-28 space-y-3">
        <FeedHeader title="The Pulse" />
        <FeedList posts={mockFeedData} />
      </main>

      <BottomNavigation />
    </div>
  );
}
