import { ComponentPropsWithRef } from "react"

export function Spacer(props: Omit<ComponentPropsWithRef<"div">, "children">) {
  return <div {...props} />
}
