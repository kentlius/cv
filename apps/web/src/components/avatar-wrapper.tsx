import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarWrapper({
  name,
  initials,
  src,
  className,
}: {
  name: string;
  initials: string;
  src?: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-28", className)}>
      {src ? <AvatarImage alt={name} src={src} /> : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
