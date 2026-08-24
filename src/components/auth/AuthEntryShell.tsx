import { redirectIfAuthenticated } from "@/lib/getSessionFromCookies";
import { GuestOnly } from "@/components/auth/GuestOnly";

export async function AuthEntryShell({
  children,
}: {
  children: React.ReactNode;
}) {
  await redirectIfAuthenticated();
  return <GuestOnly>{children}</GuestOnly>;
}
