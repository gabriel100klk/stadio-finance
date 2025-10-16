import type { Transaction, Category } from "./types"
import { addXP, checkAndUnlockBadges } from "./gamification-storage"

const TRANSACTIONS_KEY = "jogo-financeiro-transactions"
const CATEGORIES_KEY = "jogo-financeiro-categories"

export const defaultCategories: Category[] = [
  // Income categories
  { id: "1", name: "Salário (Camisa 9)", type: "income", emoji: "⚽" },
  { id: "2", name: "Freelance (Gol de Falta)", type: "income", emoji: "🎯" },
  { id: "3", name: "Renda Extra", type: "income", emoji: "💰" },

  // Fixed expense categories (Defense)
  { id: "4", name: "Aluguel (Zagueiro)", type: "fixed", emoji: "🏠" },
  { id: "5", name: "Contas (Defesa)", type: "fixed", emoji: "⚡" },
  { id: "6", name: "Internet", type: "fixed", emoji: "📡" },
  { id: "7", name: "Transporte", type: "fixed", emoji: "🚗" },

  // Variable expense categories (Midfield)
  { id: "8", name: "iFood (Meio-Campo)", type: "variable", emoji: "🍔" },
  { id: "9", name: "Lazer (Meia)", type: "variable", emoji: "🎮" },
  { id: "10", name: "Streaming", type: "variable", emoji: "📺" },
  { id: "11", name: "Compras", type: "variable", emoji: "🛍️" },

  // Investment categories
  { id: "12", name: "Poupança (Camisa 10)", type: "investment", emoji: "🏆" },
  { id: "13", name: "Investimentos", type: "investment", emoji: "📈" },
]

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(TRANSACTIONS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveTransaction(transaction: Transaction): void {
  const transactions = getTransactions()
  transactions.push(transaction)
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))

  if (typeof window !== "undefined") {
    const result = addXP(10) // 10 XP per transaction

    // Check for badge unlocks
    const unlockedBadges = checkAndUnlockBadges()

    // Show notification (will be handled by the component)
    if (typeof window !== "undefined" && (window as any).__showXPNotification) {
      ;(window as any).__showXPNotification(10, result.leveledUp, result.newLevel, unlockedBadges)
    }
  }
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions().filter((t) => t.id !== id)
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
}

export function updateTransaction(id: string, updatedTransaction: Partial<Transaction>): void {
  const transactions = getTransactions()
  const index = transactions.findIndex((t) => t.id === id)
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updatedTransaction }
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  }
}

export function getCategories(): Category[] {
  if (typeof window === "undefined") return defaultCategories
  const data = localStorage.getItem(CATEGORIES_KEY)
  return data ? JSON.parse(data) : defaultCategories
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}
