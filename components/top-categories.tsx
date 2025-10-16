import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/calculations"

interface TopCategoriesProps {
  title: string
  emoji: string
  items: Array<{ category: string; amount: number }>
  color: "primary" | "destructive" | "accent"
}

export function TopCategories({ title, emoji, items, color }: TopCategoriesProps) {
  const colorClasses = {
    primary: "text-primary border-primary/20 bg-primary/5",
    destructive: "text-destructive border-destructive/20 bg-destructive/5",
    accent: "text-accent border-accent/20 bg-accent/5",
  }

  if (items.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 text-balance">
          {emoji} {title}
        </h3>
        <p className="text-muted-foreground text-center py-4 text-sm">Nenhum lançamento nesta categoria</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4 text-balance">
        {emoji} {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${colorClasses[color]}`}>
            <span className="font-medium text-sm">{item.category}</span>
            <span className="font-bold">{formatCurrency(item.amount)}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
