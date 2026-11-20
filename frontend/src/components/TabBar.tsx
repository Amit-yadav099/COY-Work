"use client";

import type { ReactNode } from "react";

type Tab = "home" | "discover" | "matches";

type Props = {
  active: Tab;
  matchCount: number;
  onChange: (tab: Tab) => void;
};

const tabs: { id: Tab; label: string; icon: (active: boolean) => ReactNode }[] = [
  {
    id: "home",
    label: "Home",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "discover",
    label: "Discover",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="8.25"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
        />
        <path
          d="m14.8 9.2-1.4 4.2-4.2 1.4 1.4-4.2 4.2-1.4Z"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "matches",
    label: "Matches",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8.2a3.8 3.8 0 0 1 7 2.6C19 15.6 12 20 12 20Z"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinejoin="round"
          fill={active ? "currentColor" : "none"}
        />
      </svg>
    ),
  },
];

export default function TabBar({ active, matchCount, onChange }: Props) {
  return (
    <nav className="tab-bar" aria-label="Main">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`tab-item ${isActive ? "is-active" : ""}`}
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="tab-icon">
              {tab.icon(isActive)}
              {tab.id === "matches" && matchCount > 0 && (
                <span className="tab-badge">{matchCount > 9 ? "9+" : matchCount}</span>
              )}
            </span>
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
