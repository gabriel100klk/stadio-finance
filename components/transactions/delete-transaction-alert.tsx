"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteTransaction } from "@/lib/storage"
import type { Transaction } from "@/lib/types"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/calculations"
import { Loader2 } from "lucide-react"

interface DeleteTransactionAlertProps {
  transaction: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteTransactionAlert({ transaction, open, onOpenChange, onSuccess }: DeleteTransactionAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      deleteTransaction(transaction.id)
      toast.success("Lançamento excluído com sucesso!")
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error("Erro ao excluir lançamento")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
            <div className="mt-4 p-3 rounded-lg bg-muted">
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(transaction.amount)} • {new Date(transaction.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
