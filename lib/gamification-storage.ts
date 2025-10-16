import type { LocalProfile, LocalBadge } from "./types"

const PROFILE_KEY = "jogo-financeiro-profile"
const BADGES_KEY = "jogo-financeiro-badges"

// XP calculation
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function getXPForLevel(level: number): number {
  return (level - 1) ** 2 * 100
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  return getXPForLevel(currentLevel + 1)
}

export function getXPProgress(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  const currentLevelXP = getXPForLevel(currentLevel)
  const nextLevelXP = getXPForLevel(currentLevel + 1)
  const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  return Math.min(Math.max(progress, 0), 100)
}

// Default badges
const defaultBadges: LocalBadge[] = [
  {
    id: "first-transaction",
    name: "Primeiro Passe",
    description: "Adicione sua primeira transação",
    criteria: "transactions >= 1",
    imageUrl: "⚽",
    xpReward: 50,
    unlocked: false,
  },
  {
    id: "ten-transactions",
    name: "Artilheiro",
    description: "Registre 10 transações",
    criteria: "transactions >= 10",
    imageUrl: "🎯",
    xpReward: 100,
    unlocked: false,
  },
  {
    id: "first-investment",
    name: "Camisa 10",
    description: "Faça seu primeiro investimento",
    criteria: "investments >= 1",
    imageUrl: "🏆",
    xpReward: 150,
    unlocked: false,
  },
  {
    id: "level-5",
    name: "Capitão",
    description: "Alcance o nível 5",
    criteria: "level >= 5",
    imageUrl: "👑",
    xpReward: 200,
    unlocked: false,
  },
  {
    id: "fifty-transactions",
    name: "Craque",
    description: "Registre 50 transações",
    criteria: "transactions >= 50",
    imageUrl: "⭐",
    xpReward: 300,
    unlocked: false,
  },
  {
    id: "level-10",
    name: "Lenda",
    description: "Alcance o nível 10",
    criteria: "level >= 10",
    imageUrl: "🔥",
    xpReward: 500,
    unlocked: false,
  },
]

// Profile functions
export function getProfile(): LocalProfile {
  if (typeof window === "undefined") {
    return {
      username: "Jogador",
      avatarUrl: "⚽",
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
    }
  }

  const data = localStorage.getItem(PROFILE_KEY)
  if (data) {
    return JSON.parse(data)
  }

  // Create default profile
  const defaultProfile: LocalProfile = {
    username: "Jogador",
    avatarUrl: "⚽",
    xp: 0,
    level: 1,
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile))
  return defaultProfile
}

export function updateProfile(updates: Partial<LocalProfile>): void {
  const profile = getProfile()
  const updatedProfile = { ...profile, ...updates }

  // Recalculate level if XP changed
  if (updates.xp !== undefined) {
    updatedProfile.level = calculateLevel(updatedProfile.xp)
  }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile))
}

export function addXP(amount: number): { newXP: number; leveledUp: boolean; newLevel: number } {
  const profile = getProfile()
  const oldLevel = profile.level
  const newXP = profile.xp + amount
  const newLevel = calculateLevel(newXP)

  updateProfile({ xp: newXP, level: newLevel })

  return {
    newXP,
    leveledUp: newLevel > oldLevel,
    newLevel,
  }
}

// Badge functions
export function getBadges(): LocalBadge[] {
  if (typeof window === "undefined") return defaultBadges

  const data = localStorage.getItem(BADGES_KEY)
  if (data) {
    return JSON.parse(data)
  }

  localStorage.setItem(BADGES_KEY, JSON.stringify(defaultBadges))
  return defaultBadges
}

export function unlockBadge(badgeId: string): boolean {
  const badges = getBadges()
  const badge = badges.find((b) => b.id === badgeId)

  if (!badge || badge.unlocked) return false

  badge.unlocked = true
  badge.unlockedAt = new Date().toISOString()

  localStorage.setItem(BADGES_KEY, JSON.stringify(badges))

  // Award XP for unlocking badge
  addXP(badge.xpReward)

  return true
}

export function checkAndUnlockBadges(): string[] {
  const profile = getProfile()
  const badges = getBadges()
  const unlockedBadges: string[] = []

  // Get transaction count from localStorage
  const transactionsData = localStorage.getItem("jogo-financeiro-transactions")
  const transactions = transactionsData ? JSON.parse(transactionsData) : []
  const transactionCount = transactions.length
  const investmentCount = transactions.filter(
    (t: any) => t.type === "income" && t.categoryId === "12", // Investment category
  ).length

  badges.forEach((badge) => {
    if (badge.unlocked) return

    let shouldUnlock = false

    // Check criteria
    if (badge.criteria.includes("transactions >= 1") && transactionCount >= 1) {
      shouldUnlock = true
    } else if (badge.criteria.includes("transactions >= 10") && transactionCount >= 10) {
      shouldUnlock = true
    } else if (badge.criteria.includes("transactions >= 50") && transactionCount >= 50) {
      shouldUnlock = true
    } else if (badge.criteria.includes("investments >= 1") && investmentCount >= 1) {
      shouldUnlock = true
    } else if (badge.criteria.includes("level >= 5") && profile.level >= 5) {
      shouldUnlock = true
    } else if (badge.criteria.includes("level >= 10") && profile.level >= 10) {
      shouldUnlock = true
    }

    if (shouldUnlock && unlockBadge(badge.id)) {
      unlockedBadges.push(badge.name)
    }
  })

  return unlockedBadges
}

// Mock leaderboard data
export function getLeaderboard(): Array<{ username: string; xp: number; level: number; rank: number }> {
  const profile = getProfile()

  // Generate mock players
  const mockPlayers = [
    { username: "Ronaldo", xp: 2500, level: calculateLevel(2500) },
    { username: "Messi", xp: 2300, level: calculateLevel(2300) },
    { username: "Neymar", xp: 2100, level: calculateLevel(2100) },
    { username: "Pelé", xp: 1800, level: calculateLevel(1800) },
    { username: "Zico", xp: 1500, level: calculateLevel(1500) },
  ]

  // Add current player
  const allPlayers = [...mockPlayers, { username: profile.username, xp: profile.xp, level: profile.level }]

  // Sort by XP
  allPlayers.sort((a, b) => b.xp - a.xp)

  // Add ranks
  return allPlayers.map((player, index) => ({
    ...player,
    rank: index + 1,
  }))
}
