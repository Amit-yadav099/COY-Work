const express = require("express");
const cors = require("cors");
const { readDb, writeDb } = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

function getSwipedIds(db, userId) {
  return new Set(
    db.swipes
      .filter((s) => s.fromUserId === userId)
      .map((s) => s.toUserId)
  );
}

function publicProfile(profile) {
  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    photo: profile.photo,
    bio: profile.bio,
    location: profile.location,
    interests: profile.interests,
  };
}

function findMatch(db, a, b) {
  return db.matches.find(
    (m) => m.userIds.includes(a) && m.userIds.includes(b)
  );
}

/** GET /feed — profiles the current user has not swiped on */
app.get("/feed", (_req, res) => {
  try {
    const db = readDb();
    const userId = db.currentUserId;
    const swiped = getSwipedIds(db, userId);
    const feed = db.profiles
      .filter((p) => p.id !== userId && !swiped.has(p.id))
      .map(publicProfile);
    res.json({ currentUser: publicProfile(db.currentUser), profiles: feed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load feed" });
  }
});

/**
 * POST /swipe — { profileId, action: "like" | "pass" }
 * Returns { match: boolean, matchProfile?: Profile }
 * Never reveals inbound likes unless a mutual match is created.
 */
app.post("/swipe", (req, res) => {
  try {
    const { profileId, action } = req.body || {};
    if (!profileId || !["like", "pass"].includes(action)) {
      return res.status(400).json({ error: "profileId and action (like|pass) are required" });
    }

    const db = readDb();
    const userId = db.currentUserId;
    const target = db.profiles.find((p) => p.id === profileId);

    if (!target) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const already = db.swipes.find(
      (s) => s.fromUserId === userId && s.toUserId === profileId
    );
    if (already) {
      return res.status(409).json({ error: "Already swiped on this profile" });
    }

    db.swipes.push({
      fromUserId: userId,
      toUserId: profileId,
      action,
      createdAt: new Date().toISOString(),
    });

    let match = null;

    if (action === "like") {
      const theyLikedUs = db.swipes.some(
        (s) =>
          s.fromUserId === profileId &&
          s.toUserId === userId &&
          s.action === "like"
      );

      if (theyLikedUs && !findMatch(db, userId, profileId)) {
        match = {
          id: `match-${userId}-${profileId}`,
          userIds: [userId, profileId],
          createdAt: new Date().toISOString(),
        };
        db.matches.push(match);
      }
    }

    writeDb(db);

    res.json({
      ok: true,
      matched: Boolean(match),
      match: match
        ? {
            id: match.id,
            createdAt: match.createdAt,
            profile: publicProfile(target),
          }
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record swipe" });
  }
});

/** GET /matches — mutual matches only */
app.get("/matches", (_req, res) => {
  try {
    const db = readDb();
    const userId = db.currentUserId;
    const allProfiles = [db.currentUser, ...db.profiles];

    const matches = db.matches
      .filter((m) => m.userIds.includes(userId))
      .map((m) => {
        const otherId = m.userIds.find((id) => id !== userId);
        const profile = allProfiles.find((p) => p.id === otherId);
        return {
          id: m.id,
          createdAt: m.createdAt,
          profile: profile ? publicProfile(profile) : null,
        };
      })
      .filter((m) => m.profile)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load matches" });
  }
});

/** POST /reset — re-seed for demos (optional helper) */
app.post("/reset", (_req, res) => {
  try {
    const { spawnSync } = require("child_process");
    const path = require("path");
    const result = spawnSync("node", [path.join(__dirname, "seed.js")], {
      encoding: "utf8",
    });
    if (result.status !== 0) {
      throw new Error(result.stderr || "seed failed");
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Coy Discover API running on http://localhost:${PORT}`);
});
