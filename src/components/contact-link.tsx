import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ContactLink({
  children,
  href,
  tooltip,
  newtab,
}: {
  children: React.ReactNode;
  href: string;
  tooltip: string;
  newtab?: boolean;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <a
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon",
              }),
              "size-8"
            )}
            href={href}
            target={newtab ? "_blank" : undefined}
          >
            {children}
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
