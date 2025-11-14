import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export type UserRole = "user" | "admin";

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return session;
}

export async function isAdmin() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.role === "admin";
  } catch {
    return false;
  }
}

export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch {
    return null;
  }
}
