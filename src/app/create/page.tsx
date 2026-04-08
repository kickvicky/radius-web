import { Header, BottomNavigation } from "@/components/layout";
import { MapPin, Image, Send } from "lucide-react";

export default function CreatePost() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-6 pb-28">
        <h1 className="text-xl font-bold tracking-tight mb-6">Create Post</h1>

        <div className="space-y-4">
          <div className="bg-surface-container rounded-[12px] p-4">
            <textarea
              placeholder="What's happening nearby?"
              className="w-full bg-transparent text-sm resize-none outline-none min-h-[120px] placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-surface-container text-on-surface-variant text-sm">
              <MapPin className="w-4 h-4" />
              Add Location
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-surface-container text-on-surface-variant text-sm">
              <Image className="w-4 h-4" />
              Add Photo
            </button>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px] bg-gradient-to-r from-primary to-primary/80 text-surface font-semibold text-sm">
            <Send className="w-4 h-4" />
            Post to Pulse
          </button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
