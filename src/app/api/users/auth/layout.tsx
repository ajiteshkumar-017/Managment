import { getUser } from "@/lib/getUser";
import { User } from "@/models/user";
import Connect from "@/dbConnect/connect";
import { redirect } from "next/navigation";

/**
 * Gates authenticated student APIs behind a completed profile.
 * Google OAuth routes under this tree have no session yet — allow them through.
 */
export default async function StudentAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = await getUser();

  // No JWT (e.g. Google login/callback) — let the route handler run
  if (!email) {
    return <>{children}</>;
  }

  await Connect();

  const user = await User.findOne({ email }, { profileCompleted: 1 });

  if (!user?.profileCompleted) {
    redirect("/setUp");
  }

  return <>{children}</>;
}
