"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getLeaderboard, getProfile } from "@/lib/gamification-storage"
import { isLoggedIn } from "@/lib/auth-storage"

export default function RankingPage() {
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<Array<{ username: string; xp: number; level: number; rank: number }>>(
    [],
  )
  const [currentUsername, setCurrentUsername] = useState("")

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/welcome")
    }
  }, [router])

  useEffect(() => {
    const profile = getProfile()
    const data = getLeaderboard()
    setLeaderboard(data)
    setCurrentUsername(profile.username)
  }, [])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return null
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/50"
    if (rank === 2) return "bg-gray-400/10 border-gray-400/50"
    if (rank === 3) return "bg-amber-600/10 border-amber-600/50"
    return "bg-card"
  }

  if (!isLoggedIn()) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Ranking de Jogadores</CardTitle>
                <CardDescription>Veja os melhores jogadores do Stadio Finance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((player, index) => {
                const isCurrentUser = player.username === currentUsername
                const rankIcon = getRankIcon(player.rank)
                const rankColor = getRankColor(player.rank)

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${rankColor} ${
                      isCurrentUser ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 font-bold">
                      {rankIcon || `#${player.rank}`}
                    </div>

                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="text-xl">⚽</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{player.username}</h3>
                        {isCurrentUser && (
                          <Badge variant="default" className="text-xs">
                            Você
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Nível {player.level}</p>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg text-primary">{player.xp}</div>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
