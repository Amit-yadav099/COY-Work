export type Profile = {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  location: string;
  interests: string[];
};

export type MatchItem = {
  id: string;
  createdAt: string;
  profile: Profile;
};

export type SwipeResult = {
  ok: boolean;
  matched: boolean;
  match: {
    id: string;
    createdAt: string;
    profile: Profile;
  } | null;
};
