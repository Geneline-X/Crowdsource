export interface Problem {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  upvotes: number;
  createdAt: string;
  category: "infrastructure" | "sanitation" | "safety" | "other";
}

export const initialProblems: Problem[] = [
  {
    id: "1",
    title: "Broken Street Light",
    description:
      "The street light at the corner of Main St and 5th Ave has been out for a week. Very dark and dangerous at night.",
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: "Main St and 5th Ave",
    },
    upvotes: 15,
    createdAt: "2024-10-26T10:00:00Z",
    category: "safety",
  },
  {
    id: "2",
    title: "Pothole on Elm Street",
    description:
      "Large pothole causing traffic slowdowns and potential vehicle damage.",
    location: {
      lat: 40.7138,
      lng: -74.007,
      address: "123 Elm St",
    },
    upvotes: 8,
    createdAt: "2024-10-27T14:30:00Z",
    category: "infrastructure",
  },
  {
    id: "3",
    title: "Uncollected Garbage",
    description:
      "Garbage has not been collected for two weeks. Causing odor and pest issues.",
    location: {
      lat: 40.7118,
      lng: -74.005,
      address: "456 Oak Ln",
    },
    upvotes: 22,
    createdAt: "2024-10-25T09:15:00Z",
    category: "sanitation",
  },
];
