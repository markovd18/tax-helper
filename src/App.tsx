import { memo, useMemo, useState } from "react"
import "./App.css"
import { Spacer } from "./components/Spacer"

const actuallTaxBaseMultiplier = 0.5
const taxMultiplier = 0.15
const socialInsuranceMultiplier = 0.292
const healthInsuranceMultiplier = 0.135

const formatCurrency = (amount: number) => {
  return amount.toFixed(2) + ",- Kč"
}

const useExpensesSelectController = () => {
  const values = useMemo(() => [40, 60, 80], [])
  const [value, setValue] = useState(values[0])

  return { value, setValue, values }
}

type SelectProps = {
  value?: number
  values: number[]
  onSelect?: (value: number) => void
}
const ExpensesPercentageSelect = memo(({ values, onSelect, value }: SelectProps) => {
  return (
    <span className="form-item">
      <label htmlFor="expenses-select">Paušální výdaje:</label>
      <select
        id="expenses-select"
        onChange={(v) => onSelect?.(Number.parseInt(v.currentTarget.value))}
        required
        value={value}
      >
        {values.map((value) => (
          <option key={value} value={value}>
            {value}%
          </option>
        ))}
      </select>
    </span>
  )
})

export function App() {
  const [income, setIncome] = useState(100000)
  const expensesController = useExpensesSelectController()

  const { realIncome, actuallTaxBase, healthInsuranceAmount, socialInsuranceAmount } = useMemo(() => {
    const realIncome = income * ((100 - expensesController.value) / 100)
    const actuallTaxBase = realIncome * actuallTaxBaseMultiplier

    return {
      realIncome,
      actuallTaxBase,
      socialInsuranceAmount: actuallTaxBase * socialInsuranceMultiplier,
      healthInsuranceAmount: actuallTaxBase * healthInsuranceMultiplier,
    }
  }, [income, expensesController.value])

  return (
    <div className="App">
      <div className="form">
        <span className="form-item">
          <label htmlFor="income-input">Příjem:</label>
          <input
            id="income-input"
            type="number"
            value={income}
            onChange={(e) => setIncome(Number.parseInt(e.currentTarget.value))}
          />
        </span>
        <ExpensesPercentageSelect
          values={expensesController.values}
          value={expensesController.value}
          onSelect={expensesController.setValue}
        />
        <Spacer size={12} />
        Zisk (základ daně): {formatCurrency(realIncome)}
        <br />
        Daň z příjmu: {formatCurrency(realIncome * taxMultiplier)}
        <br />
        Skutečný vyměřovací základ: {formatCurrency(actuallTaxBase)}
        <br />
        Sociální pojištění: {formatCurrency(socialInsuranceAmount)}
        <br />
        Zdravotní pojištění: {formatCurrency(healthInsuranceAmount)}
      </div>

      <Spacer size={12} />

      <span id="warning">*Výpočet momentálně podporuje pouze vedlejší SVČ.</span>
    </div>
  )
}
