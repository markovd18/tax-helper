import { cn } from "@/lib/tailwind"
import { ComponentProps } from "react"

export function Paragraph({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-muted-foreground leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
}
