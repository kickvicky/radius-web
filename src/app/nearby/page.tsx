import { Header, LocationBanner, BottomNavigation } from "@/components/layout";
import { Users } from "lucide-react";

const nearbyUsers = [
  { id: "1", name: "Shadow-Walker-7", distance: "0.1 mi", status: "Active now" },
  { id: "2", name: "Neon-Drift-X", distance: "0.3 mi", status: "5m ago" },
  { id: "3", name: "Cipher-Ghost-3", distance: "0.4 mi", status: "Active now" },
  { id: "4", name: "Echo-Pulse-99", distance: "0.6 mi", status: "12m ago" },
  { id: "5", name: "Volt-Runner-5", distance: "0.8 mi", status: "Active now" },
];

export default function Nearby() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LocationBanner location="Indiranagar, Bengaluru" />

      <main className="px-4 py-4 pb-28">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold tracking-tight">Nearby</h1>
          <span className="text-xs text-primary font-medium">{nearbyUsers.length} active</span>
        </div>

        <div className="space-y-2">
          {nearbyUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 bg-surface-container rounded-[12px]"
            >
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-sm">{user.name}</span>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span>{user.distance}</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full" />
                  <span>{user.status}</span>
                </div>
              </div>
              {user.status === "Active now" && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
