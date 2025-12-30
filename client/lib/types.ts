export interface ProblemImage {
  id: number;
  problemId: number;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface ProblemVerification {
  id: number;
  latitude: number;
  longitude: number;
  imageUrls: string[];
  createdAt: string;
  fingerprint: string;
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
  status: string;
  createdAt: string;
  updatedAt: string;
  upvoteCount: number;
  verificationCount: number;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  resolutionProof?: string[];
  resolutionNotes?: string | null;
  images: ProblemImage[];
  verifications?: ProblemVerification[];
}

export interface ProblemUpvote {
  problemId: number;
  voterPhone: string;
  createdAt: string;
}
