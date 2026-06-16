import { getUser } from "@/lib/getUser";
import { User } from "@/models/user";
import {redirect} from "next/navigation"

export default async function StudentAuthLayout (
    {children}: {
  children: React.ReactNode;
}
){

    const {email} = await getUser();

    const user = await User.findOne(
    { email },
    { profileCompleted: 1 }
  );

  if (!user?.profileCompleted) {
    redirect("/setUp");
  }

  return <>{children}</>;

}