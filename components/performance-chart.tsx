"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { motion } from "framer-motion"

interface PerformanceChartProps {
  fixedExpenses: number
  variableExpenses: number
  investments: number
}

export function PerformanceChart({ fixedExpenses, variableExpenses, investments }: PerformanceChartProps) {
  const data = [
    { name: "🛡️ Defesa (Fixos)", value: fixedExpenses, color: "oklch(0.65 0.25 25)" },
    { name: "⚽ Meio-Campo (Variáveis)", value: variableExpenses, color: "oklch(0.70 0.18 265)" },
    { name: "🏆 Camisa 10 (Investimentos)", value: investments, color: "oklch(0.80 0.15 85)" },
  ].filter((item) => item.value > 0)

  if (data.length === 0) {
    return (
      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4 text-balance">⚽ Desempenho por Posição</h3>
        <p className="text-muted-foreground text-center py-8">Nenhum dado disponível para este mês</p>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-lg font-bold mb-4 text-balance">⚽ Desempenho por Posição</h3>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </Card>
  )
}
