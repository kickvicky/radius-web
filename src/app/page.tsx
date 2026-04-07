import Link from "next/link";
import { Radar, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-[20vh] px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-[16px] bg-primary/10 flex items-center justify-center mx-auto">
            <Radar className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to <span className="text-primary">Radius</span>
          </h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Discover what&apos;s happening around you. Connect anonymously with your local community in real-time.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            href="/pulse"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-[12px] bg-gradient-to-r from-primary to-primary/80 text-surface font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            Enter The Pulse
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-on-surface-variant/60">
            No account required. Stay anonymous.
          </p>
        </div>
      </div>
    </div>
  );
}
