"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  onSwipe: (direction: "like" | "pass") => void;
  disabled?: boolean;
};

const SWIPE_THRESHOLD = 120;

export default function SwipeCard({ profile, onSwipe, disabled }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const passOpacity = useTransform(x, [-140, -40], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (disabled) return;
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("like");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("pass");
    }
  }

  return (
    <motion.article
      className="swipe-card"
      style={{ x, rotate }}
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.96, opacity: 0, y: 18 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.18 },
      }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <div className="card-photo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photo}
          alt={`${profile.name}, ${profile.age}`}
          className="card-photo"
          draggable={false}
        />
        <div className="card-gradient" />

        <motion.div className="stamp stamp-like" style={{ opacity: likeOpacity }}>
          LIKE
        </motion.div>
        <motion.div className="stamp stamp-pass" style={{ opacity: passOpacity }}>
          PASS
        </motion.div>

        <div className="card-copy">
          <h2>
            {profile.name}
            <span>, {profile.age}</span>
          </h2>
          <p className="card-location">{profile.location}</p>
          <p className="card-bio">{profile.bio}</p>
          <ul className="interest-list">
            {profile.interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}
