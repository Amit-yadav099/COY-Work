"use client";

import type { MatchItem } from "@/lib/types";

type Props = {
  matches: MatchItem[];
  loading: boolean;
};

export default function MatchesView({ matches, loading }: Props) {
  if (loading) {
    return (
      <div className="panel-state">
        <div className="spinner" />
        <p>Loading matches…</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="panel-state">
        <div className="empty-orb" aria-hidden />
        <h2>No matches yet</h2>
        <p>When you both like each other, they&apos;ll show up here — never before.</p>
      </div>
    );
  }

  return (
    <div className="matches-view">
      <header className="section-header">
        <p className="eyebrow">Mutual only</p>
        <h1>Matches</h1>
        <p className="section-sub">
          {matches.length} connection{matches.length === 1 ? "" : "s"} — visible only because both of you liked.
        </p>
      </header>

      <ul className="matches-list">
        {matches.map((match) => (
          <li key={match.id} className="match-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={match.profile.photo} alt={match.profile.name} />
            <div>
              <h3>
                {match.profile.name}, {match.profile.age}
              </h3>
              <p>{match.profile.location}</p>
              <p className="match-time">
                Matched {new Date(match.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
