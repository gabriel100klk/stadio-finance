"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Plus, Trophy, Award } from "lucide-react"
import { getCategories, saveTransaction, getTransactions } from "@/lib/storage"
import type { Category, Transaction } from "@/lib/types"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { TransactionListItem } from "@/components/transactions/transaction-list-item"
import { isLoggedIn } from "@/lib/auth-storage"

type TransactionFormData = {
  date: string
  description: string
  categoryId: string
  type: "income" | "expense"
  amount: string
}

export default function LancamentosPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      description: "",
      categoryId: "",
      type: "expense",
      amount: "",
    },
  })

  const formType = watch("type")

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/welcome")
    }
  }, [router])

  useEffect(() => {
    loadData()

    if (typeof window !== "undefined") {
      ;(window as any).__showXPNotification = (
        xpGained: number,
        leveledUp: boolean,
        newLevel: number,
        unlockedBadges: string[],
      ) => {
        // Show XP gained
        toast.success(`+${xpGained} XP ganho!`, {
          icon: <Trophy className="w-4 h-4" />,
          description: leveledUp ? `🎉 Você subiu para o nível ${newLevel}!` : undefined,
        })

        // Show unlocked badges
        if (unlockedBadges.length > 0) {
          setTimeout(() => {
            unlockedBadges.forEach((badgeName, index) => {
              setTimeout(() => {
                toast.success(`Badge desbloqueada: ${badgeName}!`, {
                  icon: <Award className="w-4 h-4" />,
                  description: "Confira no seu perfil!",
                })
              }, index * 500)
            })
          }, 500)
        }
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).__showXPNotification
      }
    }
  }, [])

  const loadData = () => {
    setTransactions(getTransactions())
    setCategories(getCategories())
  }

  const onSubmit = (data: TransactionFormData) => {
    if (!data.description || !data.categoryId || !data.amount) {
      toast.error("Por favor, preencha todos os campos!")
      return
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: data.date,
      description: data.description,
      categoryId: data.categoryId,
      type: data.type,
      amount: Number.parseFloat(data.amount),
    }

    saveTransaction(newTransaction)
    loadData()

    toast.success("Lançamento adicionado com sucesso!", {
      description: `${data.type === "income" ? "Entrada" : "Saída"} de ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number.parseFloat(data.amount))}`,
    })

    reset({
      date: new Date().toISOString().split("T")[0],
      description: "",
      categoryId: "",
      type: "expense",
      amount: "",
    })
  }

  const filteredCategories = categories.filter((c) => {
    if (formType === "income") return c.type === "income"
    return c.type !== "income"
  })

  if (!isLoggedIn()) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">⚽ O Campo</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Lance todas as suas movimentações financeiras aqui
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-balance">Novo Lançamento</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" type="date" {...register("date", { required: true })} className="bg-secondary" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formType}
                    onValueChange={(value: "income" | "expense") => {
                      setValue("type", value)
                      setValue("categoryId", "")
                    }}
                  >
                    <SelectTrigger id="type" className="bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">⚽ Entrada (Gol)</SelectItem>
                      <SelectItem value="expense">💸 Saída (Gasto)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Almoço na padaria, Salário..."
                  {...register("description", { required: true })}
                  className="bg-secondary"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={watch("categoryId")} onValueChange={(value) => setValue("categoryId", value)}>
                    <SelectTrigger id="category" className="bg-secondary">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("amount", { required: true })}
                    className="bg-secondary"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Lançamento
              </Button>
            </form>
          </Card>
        </motion.div>

        <div>
          <h2 className="text-lg md:text-xl font-bold mb-4 text-balance">Histórico de Lançamentos</h2>

          {transactions.length === 0 ? (
            <Card className="p-6 md:p-8 text-center">
              <p className="text-sm md:text-base text-muted-foreground">
                Nenhum lançamento ainda. Comece adicionando suas movimentações acima!
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TransactionListItem transaction={transaction} onUpdate={loadData} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
