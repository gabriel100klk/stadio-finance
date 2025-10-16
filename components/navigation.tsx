"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, ListPlus, Settings, Trophy, User, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { getCurrentUser, logoutUser } from "@/lib/auth-storage"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [pathname]) // Re-check on route change

  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
    toast({
      title: "👋 Até logo!",
      description: "Você saiu do Stadio Finance",
    })
    router.push("/welcome")
  }

  const links = [
    { href: "/", label: "Placar do Jogo", icon: LayoutDashboard },
    { href: "/lancamentos", label: "O Campo", icon: ListPlus },
    { href: "/perfil", label: "Perfil", icon: User },
    { href: "/ranking", label: "Ranking", icon: Trophy },
    { href: "/vestiario", label: "Vestiário", icon: Settings },
  ]

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">⚽</span>
            <h1 className="text-xl font-bold text-balance">Stadio Finance</h1>
          </motion.div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="hidden sm:inline relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {currentUser && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                <span className="hidden md:inline text-sm text-muted-foreground">{currentUser.name}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
