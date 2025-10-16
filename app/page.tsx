"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { MonthSelector } from "@/components/month-selector"
import { ScoreCard } from "@/components/score-card"
import { PerformanceChart } from "@/components/performance-chart"
import { TopCategories } from "@/components/top-categories"
import { getTransactions, getCategories } from "@/lib/storage"
import { getMonthlyStats } from "@/lib/calculations"
import { motion } from "framer-motion"
import { isLoggedIn } from "@/lib/auth-storage"

export default function DashboardPage() {
  const router = useRouter()
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    investments: 0,
    topIncome: [],
    topFixed: [],
    topVariable: [],
  })

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/welcome")
    }
  }, [router])

  useEffect(() => {
    const transactions = getTransactions()
    const categories = getCategories()
    const monthlyStats = getMonthlyStats(transactions, categories, month, year)
    setStats(monthlyStats)
  }, [month, year])

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
  }

  if (!isLoggedIn()) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <MonthSelector month={month} year={year} onChange={handleMonthChange} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          key={`${month}-${year}`}
        >
          <ScoreCard totalIncome={stats.totalIncome} totalExpenses={stats.totalExpenses} balance={stats.balance} />
        </motion.div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PerformanceChart
              fixedExpenses={stats.fixedExpenses}
              variableExpenses={stats.variableExpenses}
              investments={stats.investments}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <TopCategories title="Ataque" emoji="⚽" items={stats.topIncome} color="primary" />
          </motion.div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TopCategories title="Defesa" emoji="🛡️" items={stats.topFixed} color="destructive" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <TopCategories title="Meio-Campo" emoji="🎯" items={stats.topVariable} color="accent" />
          </motion.div>
        </div>

        {stats.investments > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-md"
          >
            <div className="p-6 rounded-xl border-2 border-accent/20 bg-accent/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-balance">🏆 Camisa 10</h3>
                  <p className="text-sm text-muted-foreground">Investimentos do mês</p>
                </div>
                <p className="text-2xl font-bold text-accent">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(stats.investments)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
