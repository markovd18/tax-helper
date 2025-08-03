const currencyFormat = Intl.NumberFormat(navigator.language, {
  currency: "CZK",
  style: "currency",
})

export function formatCurrency(amount: number) {
  return currencyFormat.format(amount)
}

const percentFormat = Intl.NumberFormat(navigator.language, {
  style: "percent",
})

export function formatPercent(value: number) {
  return percentFormat.format(value)
}
