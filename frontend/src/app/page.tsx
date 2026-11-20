"use client";

import { useCallback, useEffect, useState } from "react";
import TabBar from "@/components/TabBar";
import DiscoverDeck from "@/components/DiscoverDeck";
import MatchesView from "@/components/MatchesView";
import { fetchFeed, fetchMatches, resetDemo } from "@/lib/api";
import type { MatchItem, Profile } from "@/lib/types";

type Tab = "home" | "discover" | "matches";

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("discover");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    setLoadingFeed(true);
    setError(null);
    try {
      const data = await fetchFeed();
      setProfiles(data.profiles);
      setCurrentUser(data.currentUser);
    } catch {
      setError("Could not reach the API. Start the backend on port 4000.");
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  const loadMatches = useCallback(async () => {
    setLoadingMatches(true);
    try {
      const data = await fetchMatches();
      setMatches(data.matches);
    } catch {
      /* keep prior matches if refresh fails mid-session */
    } finally {
      setLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
    loadMatches();
  }, [loadFeed, loadMatches]);

  async function handleReset() {
    try {
      await resetDemo();
      await Promise.all([loadFeed(), loadMatches()]);
      setTab("discover");
    } catch {
      setError("Reset failed. Is the backend running?");
    }
  }

  return (
    <div className="app-shell">
      <div className="app-frame">
        <main className="app-main">
          {error && (
            <div className="error-banner" role="alert">
              <p>{error}</p>
              <button type="button" onClick={loadFeed}>
                Retry
              </button>
            </div>
          )}

          {tab === "home" && (
            <div className="panel-state home-blank">
              <p className="eyebrow">Coy</p>
              <h1>Home</h1>
              <p>Placeholder for Coy&apos;s existing experience. Open Discover to swipe.</p>
            </div>
          )}

          {tab === "discover" && (
            <>
              {loadingFeed ? (
                <div className="panel-state">
                  <div className="spinner" />
                  <p>Loading profiles…</p>
                </div>
              ) : (
                <DiscoverDeck
                  profiles={profiles}
                  currentUserPhoto={currentUser?.photo}
                  onProfilesChange={setProfiles}
                  onMatched={loadMatches}
                  onViewMatches={() => setTab("matches")}
                />
              )}
            </>
          )}

          {tab === "matches" && (
            <MatchesView matches={matches} loading={loadingMatches} />
          )}
        </main>

        <div className="demo-tools">
          <button type="button" className="reset-link" onClick={handleReset}>
            Reset demo data
          </button>
        </div>

        <TabBar active={tab} matchCount={matches.length} onChange={setTab} />
      </div>
    </div>
  );
}
