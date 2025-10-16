"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { getCategories, saveCategories, defaultCategories } from "@/lib/storage"
import type { Category, CategoryType } from "@/lib/types"
import { isLoggedIn } from "@/lib/auth-storage"

export default function VestiarioPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    type: "variable" as CategoryType,
    emoji: "⚽",
  })

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/welcome")
    }
  }, [router])

  useEffect(() => {
    setCategories(getCategories())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      alert("Por favor, insira o nome da categoria!")
      return
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      emoji: formData.emoji,
    }

    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    saveCategories(updatedCategories)

    setFormData({ name: "", type: "variable", emoji: "⚽" })
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      const updatedCategories = categories.filter((c) => c.id !== id)
      setCategories(updatedCategories)
      saveCategories(updatedCategories)
    }
  }

  const handleReset = () => {
    if (
      confirm(
        "Tem certeza que deseja restaurar as categorias padrão? Isso irá remover todas as categorias personalizadas.",
      )
    ) {
      setCategories(defaultCategories)
      saveCategories(defaultCategories)
    }
  }

  const getCategoryTypeLabel = (type: CategoryType) => {
    const labels = {
      income: "⚽ Ataque (Receitas)",
      fixed: "🛡️ Defesa (Fixos)",
      variable: "🎯 Meio-Campo (Variáveis)",
      investment: "🏆 Camisa 10 (Investimentos)",
    }
    return labels[type]
  }

  const groupedCategories = {
    income: categories.filter((c) => c.type === "income"),
    fixed: categories.filter((c) => c.type === "fixed"),
    variable: categories.filter((c) => c.type === "variable"),
    investment: categories.filter((c) => c.type === "investment"),
  }

  if (!isLoggedIn()) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-balance">⚙️ Vestiário</h1>
          <p className="text-muted-foreground">Configure suas categorias de receitas e despesas</p>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-balance">Nova Categoria</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  placeholder="Ex: Academia, Netflix..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emoji">Emoji</Label>
                <Input
                  id="emoji"
                  placeholder="⚽"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="bg-secondary"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value: CategoryType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type" className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">⚽ Ataque (Receitas)</SelectItem>
                  <SelectItem value="fixed">🛡️ Defesa (Despesas Fixas)</SelectItem>
                  <SelectItem value="variable">🎯 Meio-Campo (Despesas Variáveis)</SelectItem>
                  <SelectItem value="investment">🏆 Camisa 10 (Investimentos)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Categoria
              </Button>

              <Button type="button" variant="outline" onClick={handleReset}>
                Restaurar Padrão
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          {Object.entries(groupedCategories).map(([type, cats]) => (
            <div key={type}>
              <h3 className="text-lg font-bold mb-3 text-balance">{getCategoryTypeLabel(type as CategoryType)}</h3>

              {cats.length === 0 ? (
                <Card className="p-4">
                  <p className="text-muted-foreground text-sm text-center">Nenhuma categoria neste grupo</p>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-2">
                  {cats.map((category) => (
                    <Card key={category.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{category.emoji}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
