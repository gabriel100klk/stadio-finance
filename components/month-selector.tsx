"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface MonthSelectorProps {
  month: number
  year: number
  onChange: (month: number, year: number) => void
}

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export function MonthSelector({ month, year, onChange }: MonthSelectorProps) {
  const handlePrevious = () => {
    if (month === 0) {
      onChange(11, year - 1)
    } else {
      onChange(month - 1, year)
    }
  }

  const handleNext = () => {
    if (month === 11) {
      onChange(0, year + 1)
    } else {
      onChange(month + 1, year)
    }
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="ghost" size="icon" onClick={handlePrevious} className="hover:bg-secondary">
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="text-center min-w-[200px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.h2
            key={`${month}-${year}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-balance"
          >
            {monthNames[month]} {year}
          </motion.h2>
        </AnimatePresence>
      </div>

      <Button variant="ghost" size="icon" onClick={handleNext} className="hover:bg-secondary">
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  )
}
