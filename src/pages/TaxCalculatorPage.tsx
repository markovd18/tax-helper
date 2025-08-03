import { ComponentPropsWithRef, useMemo, useState } from "react"
import { ThemeToggleButton } from "@/components/ThemeToggleButton"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { PageContainer } from "@/components/Page"
import { Spacer } from "@/components/ui/Spacer"
import { cn } from "@/lib/tailwind"
import { formatCurrency, formatPercent } from "@/lib/format"
import { IconBrandGithub, IconBrandLinkedin, IconCopyright } from "@tabler/icons-react"
import { Button } from "@/components/ui/Button"
import { Paragraph } from "@/components/ui/Paragraph"

const actualTaxBasePercentage = 0.5
const incomeTaxPercentage = 0.15
const socialInsurancePercentage = 0.292
const healthInsurancePercentage = 0.135

const EXPENSE_PERCENTAGES = [0.4, 0.6, 0.8] as const

export function TaxCalculatorPage() {
  const [income, setIncome] = useState(100_000)
  const [expensePercentage, setExpensePercentage] = useState<number>(EXPENSE_PERCENTAGES[0])

  const { realIncome, incomeTax, actualTaxBase, healthInsuranceAmount, socialInsuranceAmount } = useMemo(() => {
    const realIncome = income * (1 - expensePercentage)
    const actualTaxBase = realIncome * actualTaxBasePercentage

    return {
      realIncome,
      actualTaxBase,
      incomeTax: realIncome * incomeTaxPercentage,
      socialInsuranceAmount: actualTaxBase * socialInsurancePercentage,
      healthInsuranceAmount: actualTaxBase * healthInsurancePercentage,
    }
  }, [income, expensePercentage])

  return (
    <main className="h-svh">
      <PageContainer>
        <div className="">
          <section className="text-start">
            <h1 className="scroll-m-20 text-4xl">Daňová kalkulačka</h1>
            <Paragraph className="text-xl">
              Zadejte vaše příjmy, zvolte výši paušálních výdajů a získejte stručný přehled o výši daně z příjmu a
              vašich odvodech na důchodovém a nemocenském pojištění.
            </Paragraph>
            <Paragraph className="italic text-sm leading-none">
              * Kalkulačka zatím nepodporuje minimální výše záloh, zohlednění odpočtů a režim paušální daně.
            </Paragraph>
          </section>

          <Spacer className="h-12" />

          <form className="flex flex-col sm:flex-row gap-8 w-full sm:w-[initial]">
            <div className="flex-1/2">
              <FormItem>
                <Label htmlFor="income-input">Příjem (Kč):</Label>
                <Input
                  id="income-input"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number.parseInt(e.currentTarget.value))}
                />
              </FormItem>
              <Spacer className="h-3" />
              <ExpensesPercentageSelect value={expensePercentage} onSelect={setExpensePercentage} />
            </div>

            <Table className="flex-1/2">
              <TableHeader>
                <TableHead className="text-start">Položka</TableHead>
                <TableHead className="text-end">Částka</TableHead>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-start">Zisk (základ daně):</TableCell>
                  <TableCell className="text-end">{formatCurrency(realIncome)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-start">Skutečný vyměřovací základ:</TableCell>
                  <TableCell className="text-end">{formatCurrency(actualTaxBase)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-start">Daň z příjmu:</TableCell>
                  <TableCell className="text-end">{formatCurrency(incomeTax)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-start">Důchodové pojištění:</TableCell>
                  <TableCell className="text-end">{formatCurrency(socialInsuranceAmount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-start">Zdravotní pojištění:</TableCell>
                  <TableCell className="text-end">{formatCurrency(healthInsuranceAmount)}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow className="border-t">
                  <TableCell className="text-start">Celkové výdaje:</TableCell>
                  <TableCell className="text-end">
                    {formatCurrency(incomeTax + healthInsuranceAmount + socialInsuranceAmount)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </form>
        </div>
      </PageContainer>
      <footer className="bg-sidebar-accent border-t lg:absolute bottom-0 left-0 right-0">
        <PageContainer>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCopyright className="size-3" />
            David Markov 2025
            <span>
              <Button size="icon" variant="ghost" asChild>
                <a href="https://www.linkedin.com/in/david-markov-9070ba181/" target="_blank" rel="noopenner">
                  <IconBrandLinkedin className="size-6" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <a href="https://github.com/markovd18/tax-helper" target="_blank" rel="noopenner">
                  <IconBrandGithub className="size-6" />
                </a>
              </Button>
            </span>
          </div>
        </PageContainer>
      </footer>

      <ThemeToggleButton />
    </main>
  )
}

type SelectProps = {
  value?: number
  onSelect?: (value: number) => void
}

function ExpensesPercentageSelect({ onSelect, value }: SelectProps) {
  const id = "expenses-select"
  return (
    <FormItem>
      <Label htmlFor={id}>Paušální výdaje: </Label>
      <Select onValueChange={(value) => onSelect?.(Number.parseFloat(value))} required value={value?.toString()}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {EXPENSE_PERCENTAGES.map((value) => (
            <SelectItem key={value} value={value.toString()}>
              {formatPercent(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  )
}

function FormItem(props: ComponentPropsWithRef<"div">) {
  const { children, className, ...rest } = props
  return (
    <div className={cn("grid w-full items-center gap-3", className)} {...rest}>
      {children}
    </div>
  )
}
