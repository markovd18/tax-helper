import { cn } from "@/lib/tailwind"
import { ComponentProps } from "react"

export function PageContainer({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("max-w-5xl my-0 mx-auto p-8", className)} {...props} />
}
