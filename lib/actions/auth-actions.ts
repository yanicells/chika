"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};

export const signInSocial = async (provider: "github") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/notes",
    },
  });

  if (url) {
    redirect(url);
  }
};
