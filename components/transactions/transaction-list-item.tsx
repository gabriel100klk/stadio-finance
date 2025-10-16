"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/calculations"
import type { Transaction } from "@/lib/types"
import { EditTransactionDialog } from "./edit-transaction-dialog"
import { DeleteTransactionAlert } from "./delete-transaction-alert"

interface TransactionListItemProps {
  transaction: Transaction
  onUpdate: () => void
}

export function TransactionListItem({ transaction, onUpdate }: TransactionListItemProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const getTypeDisplay = () => {
    if (transaction.type === "income") return { label: "⚽ Entrada", color: "text-primary" }
    return { label: "💸 Saída", color: "text-destructive" }
  }

  const typeDisplay = getTypeDisplay()

  return (
    <>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-sm font-medium ${typeDisplay.color}`}>{typeDisplay.label}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(transaction.date).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <p className="font-medium truncate">{transaction.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className={`text-lg font-bold whitespace-nowrap ${typeDisplay.color}`}>
              {formatCurrency(transaction.amount)}
            </p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteAlert(true)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <EditTransactionDialog
        transaction={transaction}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />

      <DeleteTransactionAlert
        transaction={transaction}
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        onSuccess={onUpdate}
      />
    </>
  )
}
