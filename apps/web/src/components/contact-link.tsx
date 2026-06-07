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
  className,
}: {
  children: React.ReactNode;
  href: string;
  tooltip: string;
  newtab?: boolean;
  className?: string;
}) {
  return (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger
          render={
            <a
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "icon",
                }),
                "size-8",
                className
              )}
              href={href}
              target={newtab ? "_blank" : undefined}
              rel={newtab ? "noreferrer noopener" : undefined}
            />
          }
        >
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
