export interface ProblemImage {
  id: number;
  problemId: number;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

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
  nationalCategory: string | null;
  recommendedOffice: string | null;
  createdAt: string;
  updatedAt: string;
  upvoteCount: number;
  verificationCount: number;
  images: ProblemImage[];
}

export interface ProblemUpvote {
  problemId: number;
  voterPhone: string;
  createdAt: string;
}
