export interface Problem {
  id: number;
  reporterPhone: string;
  rawMessage: string;
  title: string;
  locationText: string | null;
  latitude: number | null;
  longitude: number | null;
  locationVerified: boolean;
  locationSource: string | null;
  createdAt: string;
  updatedAt: string;
  upvoteCount: number;
}

export interface ProblemUpvote {
  problemId: number;
  voterPhone: string;
  createdAt: string;
}
