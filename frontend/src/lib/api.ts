import type { MatchItem, Profile, SwipeResult } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function fetchFeed() {
  return request<{ currentUser: Profile; profiles: Profile[] }>("/feed");
}

export function postSwipe(profileId: string, action: "like" | "pass") {
  return request<SwipeResult>("/swipe", {
    method: "POST",
    body: JSON.stringify({ profileId, action }),
  });
}

export function fetchMatches() {
  return request<{ matches: MatchItem[] }>("/matches");
}

export function resetDemo() {
  return request<{ ok: boolean }>("/reset", { method: "POST" });
}
