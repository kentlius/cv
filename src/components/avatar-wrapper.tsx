import { RESUME_DATA } from "@/data/resume-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarWrapper() {
  return (
    <Avatar className="size-28">
      <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
      <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
    </Avatar>
  );
}
