import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const Notes = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  const user = session.user;

  return(
    <div>
      Notes Page - Welcome {user.email}
      User Details: {JSON.stringify(user)}
    </div>
  )
};

export default Notes;
