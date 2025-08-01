import { PropsWithChildren, SelectHTMLAttributes } from "react"

type Props = {} & SelectHTMLAttributes<HTMLSelectElement>
export const Select = (props: PropsWithChildren<Props>) => {
  return <select {...props}></select>
}

export const SelectItem = () => {
  return <option></option>
}
