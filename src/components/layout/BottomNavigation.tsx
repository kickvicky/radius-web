"use client";

import { useState } from "react";
import { Home, Radar, PlusCircle, Users, User, LucideIcon } from "lucide-react";

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "pulse", icon: Radar, label: "Pulse" },
  { id: "create", icon: PlusCircle, label: "Post" },
  { id: "nearby", icon: Users, label: "Nearby" },
  { id: "profile", icon: User, label: "Profile" },
];

export function BottomNavigation() {
  const [activeTab, setActiveTab] = useState("pulse");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isCreate = item.id === "create";

          if (isCreate) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-1 px-4 py-1"
              >
                <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                  <Icon className="w-6 h-6 text-surface" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-[12px] transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
