import { MapPin } from "lucide-react";

interface LocationBannerProps {
  location?: string;
}

export function LocationBanner({ location = "Indiranagar, Bengaluru" }: LocationBannerProps) {
  return (
    <div className="bg-surface-container border-b border-outline-variant/15">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium tracking-widest text-on-surface-variant">
          Near: {location}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <span className="text-xs text-primary font-medium">Live</span>
        </div>
      </div>
    </div>
  );
}
