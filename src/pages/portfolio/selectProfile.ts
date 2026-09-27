import type { UserProfile } from "@/api/user";
import type { PersonalCardProps } from "../home/components/PersonalCard";

export function toPersonalCardProfile(user: UserProfile): PersonalCardProps {
  const role = user.role ?? "Professional";
  const common = {
    name: user.name,
    job: user.jobTitle ?? "",
    phone: user.phone ?? "",
    email: user.email,
    address: "",
  };

  if (role === "Student") {
    return { ...common, role };
  }

  return { ...common, role, tel: user.tel ?? "" };
}
