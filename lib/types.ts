export type TransactionType = "income" | "expense"

export type CategoryType = "fixed" | "variable" | "income" | "investment"

export interface Category {
  id: string
  name: string
  type: CategoryType
  emoji?: string
}

export interface Transaction {
  id: string
  date: string
  description: string
  categoryId: string
  type: TransactionType
  amount: number
}

export interface DbTransaction {
  id: string
  user_id: string
  type: "income" | "fixed_expense" | "variable_expense" | "investment"
  category: string
  amount: number
  description: string
  date: string
  created_at: string
  updated_at: string
}

export interface MonthlyStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  fixedExpenses: number
  variableExpenses: number
  investments: number
  topIncome: Array<{ category: string; amount: number }>
  topFixed: Array<{ category: string; amount: number }>
  topVariable: Array<{ category: string; amount: number }>
}

export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  xp: number
  created_at: string
  updated_at: string
}

export interface Badge {
  id: number
  name: string
  description: string | null
  criteria: string
  image_url: string | null
  xp_reward: number
  created_at: string
}

export interface UserBadge {
  user_id: string
  badge_id: number
  created_at: string
  badge?: Badge
}

export interface LeaderboardEntry {
  id: string
  username: string
  avatar_url: string | null
  xp: number
  rank: number
}

export interface LocalProfile {
  username: string
  avatarUrl: string
  xp: number
  level: number
  createdAt: string
}

export interface LocalBadge {
  id: string
  name: string
  description: string
  criteria: string
  imageUrl: string
  xpReward: number
  unlocked: boolean
  unlockedAt?: string
}
