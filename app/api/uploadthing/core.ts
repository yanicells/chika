import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * Uploadthing file router
 * Defines upload endpoints for different content types
 */
export const ourFileRouter = {
  // Image uploader for notes, comments, and blog posts
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Upload complete:", file.ufsUrl);
    return { url: file.ufsUrl };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
