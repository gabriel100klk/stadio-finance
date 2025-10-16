"use client"

import { formatCurrency } from "@/lib/calculations"
import { TrendingUp, TrendingDown, Trophy } from "lucide-react"
import { motion } from "framer-motion"

interface ScoreCardProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export function ScoreCard({ totalIncome, totalExpenses, balance }: ScoreCardProps) {
  const isPositive = balance >= 0

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-4 md:p-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Trophy className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          <h3 className="text-lg md:text-xl font-bold text-balance">Placar do Mês</h3>
        </div>

        <div className="flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Gols Marcados (Receitas)</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(totalIncome)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span>Gols Sofridos (Despesas)</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 text-accent" />
              <span>Resultado da Partida</span>
            </div>
            <p className={`text-2xl md:text-3xl font-bold ${isPositive ? "text-primary" : "text-destructive"}`}>
              {formatCurrency(balance)}
            </p>
            <p className="text-sm text-muted-foreground">{isPositive ? "🎉 Vitória!" : "⚠️ Derrota"}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
