import { Header, BottomNavigation } from "@/components/layout";
import { CreatePostFormDynamic } from "@/components/feed";

export default function CreatePost() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-6 pb-28">
        <h1 className="text-xl font-bold tracking-tight mb-6">Create Post</h1>
        <CreatePostFormDynamic />
      </main>

      <BottomNavigation />
    </div>
  );
}
