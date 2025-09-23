import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        auxiliary: "border-transparent text-primary-foreground text-xs font-medium",
        scope: "border-transparent bg-badge-scope text-primary-foreground text-xs font-medium",
        sports: "border-transparent bg-primary text-primary-foreground text-xs font-medium",
        atfal: "border-transparent bg-auxiliary-atfal text-primary-foreground text-xs font-medium",
        khuddam: "border-transparent bg-auxiliary-khuddam text-primary-foreground text-xs font-medium",
        lajna: "border-transparent bg-auxiliary-lajna text-primary-foreground text-xs font-medium",
        ansar: "border-transparent bg-auxiliary-ansar text-primary-foreground text-xs font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
