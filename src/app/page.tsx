import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/getSessionFromCookies";

export default async function Home() {
  const session = await getSessionFromCookies();
  redirect(session ? session.home : "/landingPage");
}
