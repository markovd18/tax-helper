import { ComponentPropsWithRef, useMemo, useState } from "react"
import { Spacer } from "./components/Spacer"

const actuallTaxBaseMultiplier = 0.5
const taxMultiplier = 0.15
const socialInsuranceMultiplier = 0.292
const healthInsuranceMultiplier = 0.135

const formatCurrency = (amount: number) => {
  return amount.toFixed(2) + ",- Kč"
}

const EXPENSE_PERCENTAGES = [40, 60, 80] as const

type SelectProps = {
  value?: number
  onSelect?: (value: number) => void
}

function ExpensesPercentageSelect({ onSelect, value }: SelectProps) {
  const id = "expenses-select"
  return (
    <FormItem>
      <label htmlFor={id}>Paušální výdaje: </label>
      <select id={id} onChange={(v) => onSelect?.(Number.parseInt(v.currentTarget.value))} required value={value}>
        {EXPENSE_PERCENTAGES.map((value) => (
          <option key={value} value={value}>
            {value}%
          </option>
        ))}
      </select>
    </FormItem>
  )
}

export function App() {
  const [income, setIncome] = useState(100_000)
  const [expensePercentage, setExpensePercentage] = useState<number>(EXPENSE_PERCENTAGES[0])

  const { realIncome, actuallTaxBase, healthInsuranceAmount, socialInsuranceAmount } = useMemo(() => {
    const realIncome = income * ((100 - expensePercentage) / 100)
    const actuallTaxBase = realIncome * actuallTaxBaseMultiplier

    return {
      realIncome,
      actuallTaxBase,
      socialInsuranceAmount: actuallTaxBase * socialInsuranceMultiplier,
      healthInsuranceAmount: actuallTaxBase * healthInsuranceMultiplier,
    }
  }, [income, expensePercentage])

  return (
    <div className="max-w-7xl my-0 mx-auto p-8 text-center">
      <div className="flex flex-col justify-center items-center h-svh">
        <form>
          <FormItem>
            <label htmlFor="income-input">Příjem: </label>
            <input
              id="income-input"
              type="number"
              value={income}
              onChange={(e) => setIncome(Number.parseInt(e.currentTarget.value))}
            />
          </FormItem>
          <ExpensesPercentageSelect value={expensePercentage} onSelect={setExpensePercentage} />
          <Spacer className="h-3" />
          Zisk (základ daně): {formatCurrency(realIncome)}
          <br />
          Daň z příjmu: {formatCurrency(realIncome * taxMultiplier)}
          <br />
          Skutečný vyměřovací základ: {formatCurrency(actuallTaxBase)}
          <br />
          Sociální pojištění: {formatCurrency(socialInsuranceAmount)}
          <br />
          Zdravotní pojištění: {formatCurrency(healthInsuranceAmount)}
        </form>

        <Spacer className="h-3" />

        <span className="italic text-xs">*Výpočet momentálně podporuje pouze vedlejší SVČ.</span>
      </div>
    </div>
  )
}

function FormItem(props: ComponentPropsWithRef<"div">) {
  const { children, ...rest } = props
  return <div {...rest}>{children}</div>
}
