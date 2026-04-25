import { Radar, Bell } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export async function Header() {
  // Shared across every page render via React.cache — no extra Gateway call
  // when the page itself also needs the user.
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[12px] bg-primary/10 flex items-center justify-center">
            <Radar className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Radius</span>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <span
              className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-[10px] bg-surface-container-high/60 text-xs font-medium text-on-surface-variant max-w-[14ch] truncate"
              title={user.name || user.username}
            >
              @{user.username}
            </span>
          )}
          <button className="relative w-10 h-10 rounded-[12px] bg-surface-container-high/60 flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
