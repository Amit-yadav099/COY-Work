const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "db.json");

const CURRENT_USER = {
  id: "user-0",
  name: "Alex",
  age: 26,
  photo: "https://i.pravatar.cc/600?u=coy-user-0",
  bio: "Coffee, late-night walks, and good conversation.",
  location: "San Francisco, CA",
  interests: ["Coffee", "Hiking", "Live Music"],
};

const FIRST_NAMES = [
  "Maya", "Jordan", "Priya", "Sam", "Ava", "Leo", "Nina", "Kai",
  "Sofia", "Noah", "Zara", "Ethan", "Lila", "Owen", "Iris", "Miles",
  "Chloe", "Ravi", "Emma", "Theo", "Aria", "Felix", "Jade", "Hugo",
  "Nora", "Luca", "Mila", "Asher", "Ruby", "Ben", "Ivy", "Cole",
  "Elena", "Finn", "Sienna",
];

const BIOS = [
  "Looking for someone who laughs at bad puns.",
  "Weekend baker, weekday designer.",
  "Always planning the next trip.",
  "Dog parent. Amateur photographer.",
  "Fluent in playlists and pasta recipes.",
  "Sunsets > sunrises. Fight me.",
  "Book club regular. Mild spice tolerance.",
  "Climbing walls and climbing careers.",
  "Here for genuine connections, not small talk.",
  "Will match if you like rainy days too.",
  "Film buff who still uses a film camera.",
  "Runner by morning, gamer by night.",
  "Plant collector with too many opinions on coffee.",
  "Trying new restaurants one dish at a time.",
  "Museum hopper and thrift store hunter.",
];

const LOCATIONS = [
  "Stanford University",
  "UC Berkeley",
  "San Francisco, CA",
  "Oakland, CA",
  "Palo Alto, CA",
  "San Jose, CA",
  "Mission District",
  "SF State",
  "Berkeley, CA",
  "South Bay",
];

const INTERESTS = [
  "Hiking", "Coffee", "Photography", "Cooking", "Travel", "Yoga",
  "Music", "Art", "Running", "Movies", "Reading", "Dancing",
  "Gaming", "Surfing", "Food", "Fitness", "Dogs", "Cats",
  "Startups", "Poetry", "Camping", "Wine", "Concerts", "Design",
];

function pick(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

function buildProfiles() {
  return FIRST_NAMES.slice(0, 32).map((name, index) => {
    const id = `user-${index + 1}`;
    return {
      id,
      name,
      age: 21 + ((index * 3) % 14),
      photo: `https://i.pravatar.cc/600?u=coy-${id}`,
      bio: BIOS[index % BIOS.length],
      location: LOCATIONS[index % LOCATIONS.length],
      interests: pick(INTERESTS, 3 + (index % 3)),
    };
  });
}

function buildDb() {
  const profiles = buildProfiles();

  // Some profiles have already liked the logged-in user (for demo matches)
  const inboundLikes = [1, 3, 5, 8, 12, 15, 18, 22, 27].map((n) => ({
    fromUserId: `user-${n}`,
    toUserId: CURRENT_USER.id,
    action: "like",
    createdAt: new Date(Date.now() - n * 3600_000).toISOString(),
  }));

  return {
    currentUserId: CURRENT_USER.id,
    currentUser: CURRENT_USER,
    profiles,
    swipes: inboundLikes,
    matches: [],
  };
}

function seed() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = buildDb();
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2));
  console.log(`Seeded ${db.profiles.length} profiles and ${db.swipes.length} inbound likes → ${DATA_PATH}`);
}

seed();
