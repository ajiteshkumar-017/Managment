import { Faculty } from "@/models/faculty.model";
import { Subject } from "@/models/subject.model";
import { User } from "@/models/user";

export async function resolveFacultyByUsername(username: string) {
  if (!username) return null;
  const user = await User.findOne({ username }).select("_id");
  if (!user) return null;
  return await Faculty.findOne({ userId: user._id }).populate("userId", "username");
}

export async function resolveSubjectByCode(subjectCode: string) {
  if (!subjectCode) return null;
  return await Subject.findOne({ subjectCode });
}
