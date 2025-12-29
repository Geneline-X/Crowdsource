import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for verification image uploads
export const ourFileRouter = {
  // Verification images uploader
  verificationImages: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      // No auth required, but we could add fingerprint validation here
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Verification image uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
