"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { headers } from "next/headers";

export const signOut = async () => {
  await auth.api.signOut({ headers: await headers() });
  // Revalidate all paths to clear cached session data
  revalidatePath("/", "layout");
  redirect("/");
};

export const signInSocial = async (provider: "github") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/notes",
    },
  });

  if (url) {
    // Revalidate to clear any cached auth state
    revalidatePath("/", "layout");
    redirect(url);
  }
};

export const handleAuthCallback = async () => {
  "use server";
  // Revalidate all paths after successful login
  revalidatePath("/", "layout");
};
