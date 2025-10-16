"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Trophy, Star, Award, Edit2, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getProfile, updateProfile, getBadges, getXPForNextLevel, getXPProgress } from "@/lib/gamification-storage"
import { getCurrentUser, isLoggedIn } from "@/lib/auth-storage"
import type { LocalProfile, LocalBadge } from "@/lib/types"

export default function PerfilPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<LocalProfile | null>(null)
  const [badges, setBadges] = useState<LocalBadge[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editUsername, setEditUsername] = useState("")
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/welcome")
    }
  }, [router])

  useEffect(() => {
    const loadedProfile = getProfile()
    const loadedBadges = getBadges()
    const user = getCurrentUser()
    setProfile(loadedProfile)
    setBadges(loadedBadges)
    setEditUsername(loadedProfile.username)
    setCurrentUser(user)
  }, [])

  const handleSaveProfile = () => {
    if (editUsername.trim()) {
      updateProfile({ username: editUsername.trim() })
      setProfile(getProfile())
      setEditDialogOpen(false)
    }
  }

  if (!isLoggedIn() || !profile) {
    return null
  }

  const nextLevelXP = getXPForNextLevel(profile.xp)
  const progress = getXPProgress(profile.xp)
  const unlockedBadges = badges.filter((b) => b.unlocked)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
                  {profile.avatarUrl}
                </div>
                <div>
                  <CardTitle className="text-2xl">{profile.username}</CardTitle>
                  <CardDescription>
                    Nível {profile.level} • {profile.xp} XP
                  </CardDescription>
                  {currentUser && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {currentUser.email}
                    </div>
                  )}
                </div>
              </div>
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>Atualize suas informações</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de Usuário</Label>
                      <Input
                        id="username"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        placeholder="Digite seu nome"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full">
                    Salvar
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progresso para Nível {profile.level + 1}</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">{nextLevelXP - profile.xp} XP para o próximo nível</p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                  <Trophy className="w-5 h-5" />
                  {profile.level}
                </div>
                <p className="text-xs text-muted-foreground">Nível</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                  <Star className="w-5 h-5" />
                  {profile.xp}
                </div>
                <p className="text-xs text-muted-foreground">XP Total</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                  <Award className="w-5 h-5" />
                  {unlockedBadges.length}
                </div>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Conquistas</CardTitle>
            <CardDescription>
              {unlockedBadges.length} de {badges.length} badges desbloqueadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    badge.unlocked ? "border-primary bg-primary/5" : "border-border bg-muted/50 opacity-50"
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{badge.imageUrl}</div>
                    <div>
                      <h3 className="font-semibold text-sm">{badge.name}</h3>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                    {badge.unlocked ? (
                      <Badge variant="default" className="text-xs">
                        Desbloqueada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Bloqueada
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
