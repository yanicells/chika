import { getCurrentSession, requireAdmin } from "@/lib/auth-helper";

const Notes = async () => {
  await requireAdmin();

  const session = await getCurrentSession();
  const user = session!.user;

  return(
    <div>
      Notes Page - Welcome {user.email}
      User Details: {JSON.stringify(user)}
      Role: {user.role}
    </div>
  )
};

export default Notes;
