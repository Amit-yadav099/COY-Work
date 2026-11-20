"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SwipeCard from "./SwipeCard";
import MatchModal from "./MatchModal";
import { postSwipe } from "@/lib/api";
import type { Profile } from "@/lib/types";

type Props = {
  profiles: Profile[];
  currentUserPhoto?: string;
  onProfilesChange: (profiles: Profile[]) => void;
  onMatched: () => void;
  onViewMatches: () => void;
};

export default function DiscoverDeck({
  profiles,
  currentUserPhoto,
  onProfilesChange,
  onMatched,
  onViewMatches,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [exitDir, setExitDir] = useState<"like" | "pass" | null>(null);
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
  const [feedback, setFeedback] = useState<"like" | "pass" | null>(null);

  const current = profiles[0] ?? null;

  const completeSwipe = useCallback(
    async (direction: "like" | "pass") => {
      if (!current || busy) return;
      setBusy(true);
      setExitDir(direction);
      setFeedback(direction);

      try {
        const result = await postSwipe(current.id, direction);
        onProfilesChange(profiles.slice(1));

        if (result.matched && result.match?.profile) {
          setMatchProfile(result.match.profile);
          onMatched();
        }
      } catch (err) {
        console.error(err);
        setExitDir(null);
      } finally {
        setTimeout(() => {
          setFeedback(null);
          setExitDir(null);
          setBusy(false);
        }, 280);
      }
    },
    [busy, current, onMatched, onProfilesChange, profiles]
  );

  if (!current) {
    return (
      <div className="panel-state discover-empty">
        <div className="empty-orb" aria-hidden />
        <h2>You&apos;re all caught up</h2>
        <p>No more profiles right now. Check Matches or reset the demo to swipe again.</p>
      </div>
    );
  }

  return (
    <div className="discover">
      <header className="discover-header">
        <p className="eyebrow">Discover</p>
        <h1>Find your people</h1>
        <p className="section-sub">
          Swipe right to like, left to pass. Matches stay mutual — always.
        </p>
      </header>

      <div className="deck-stage">
        <AnimatePresence>
          {feedback && (
            <motion.div
              key={feedback}
              className={`swipe-toast swipe-toast-${feedback}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {feedback === "like" ? "Liked" : "Passed"}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="deck">
          {profiles[1] && (
            <div className="swipe-card swipe-card-next" aria-hidden>
              <div className="card-photo-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profiles[1].photo} alt="" className="card-photo" />
                <div className="card-gradient" />
              </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {current && (
              <motion.div
                key={current.id}
                className="deck-front"
                exit={{
                  x: exitDir === "like" ? 420 : exitDir === "pass" ? -420 : 0,
                  opacity: 0,
                  rotate: exitDir === "like" ? 18 : exitDir === "pass" ? -18 : 0,
                  transition: { duration: 0.28, ease: "easeIn" },
                }}
              >
                <SwipeCard
                  profile={current}
                  onSwipe={completeSwipe}
                  disabled={busy}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="swipe-actions">
        <button
          type="button"
          className="action-btn action-pass"
          aria-label="Pass"
          disabled={busy}
          onClick={() => completeSwipe("pass")}
        >
          ✕
        </button>
        <button
          type="button"
          className="action-btn action-like"
          aria-label="Like"
          disabled={busy}
          onClick={() => completeSwipe("like")}
        >
          ♥
        </button>
      </div>

      <p className="gesture-hint">Drag the card on mobile · use buttons on desktop</p>

      <AnimatePresence>
        {matchProfile && (
          <MatchModal
            profile={matchProfile}
            currentUserPhoto={currentUserPhoto}
            onKeepSwiping={() => setMatchProfile(null)}
            onViewMatches={() => {
              setMatchProfile(null);
              onViewMatches();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
