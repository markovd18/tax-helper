import { ComponentPropsWithRef } from "react"

export function Spacer(props: Omit<ComponentPropsWithRef<"span">, "children">) {
  return <span {...props} />
}
