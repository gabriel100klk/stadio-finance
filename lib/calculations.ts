import type { Transaction, Category, MonthlyStats } from "./types"

export function getMonthlyStats(
  transactions: Transaction[],
  categories: Category[],
  month: number,
  year: number,
): MonthlyStats {
  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() === month && date.getFullYear() === year
  })

  const totalIncome = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const getCategoryType = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.type
  }

  const fixedExpenses = monthTransactions
    .filter((t) => t.type === "expense" && getCategoryType(t.categoryId) === "fixed")
    .reduce((sum, t) => sum + t.amount, 0)

  const variableExpenses = monthTransactions
    .filter((t) => t.type === "expense" && getCategoryType(t.categoryId) === "variable")
    .reduce((sum, t) => sum + t.amount, 0)

  const investments = monthTransactions
    .filter((t) => getCategoryType(t.categoryId) === "investment")
    .reduce((sum, t) => sum + t.amount, 0)

  // Top 3 by category
  const getTopByType = (type: string, transactionType?: "income" | "expense") => {
    const filtered = monthTransactions.filter((t) => {
      const catType = getCategoryType(t.categoryId)
      const typeMatch = catType === type
      const transTypeMatch = !transactionType || t.type === transactionType
      return typeMatch && transTypeMatch
    })

    const grouped = filtered.reduce(
      (acc, t) => {
        const category = categories.find((c) => c.id === t.categoryId)
        if (category) {
          acc[category.name] = (acc[category.name] || 0) + t.amount
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(grouped)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
  }

  return {
    totalIncome,
    totalExpenses,
    balance,
    fixedExpenses,
    variableExpenses,
    investments,
    topIncome: getTopByType("income", "income"),
    topFixed: getTopByType("fixed", "expense"),
    topVariable: getTopByType("variable", "expense"),
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
