import * as React from "react";

import { cn } from "@/lib/utils";

function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="section"
      className={cn("space-y-3 print:space-y-2", className)}
      {...props}
    />
  );
}

export { Section };
