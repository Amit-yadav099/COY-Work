"use client";

import { motion } from "framer-motion";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  currentUserPhoto?: string;
  onKeepSwiping: () => void;
  onViewMatches: () => void;
};

export default function MatchModal({
  profile,
  currentUserPhoto,
  onKeepSwiping,
  onViewMatches,
}: Props) {
  return (
    <motion.div
      className="match-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
    >
      <motion.div
        className="match-panel"
        initial={{ scale: 0.88, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <p className="match-eyebrow">Coy</p>
        <h2 id="match-title">It&apos;s a match!</h2>
        <p className="match-sub">
          You and {profile.name} liked each other. Start the conversation when you&apos;re ready.
        </p>

        <div className="match-photos">
          <div className="match-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUserPhoto || "https://i.pravatar.cc/600?u=coy-user-0"}
              alt="You"
            />
          </div>
          <div className="match-heart" aria-hidden>
            ♥
          </div>
          <div className="match-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.photo} alt={profile.name} />
          </div>
        </div>

        <div className="match-actions">
          <button type="button" className="btn btn-primary" onClick={onViewMatches}>
            View matches
          </button>
          <button type="button" className="btn btn-ghost" onClick={onKeepSwiping}>
            Keep discovering
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
