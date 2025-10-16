export interface User {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  createdAt: string
}

const USERS_KEY = "jogo-financeiro-users"
const CURRENT_USER_KEY = "jogo-financeiro-current-user"

// Simple hash function (NOT secure for production, just for demo)
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export function createUser(name: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers()

  // Check if email already exists
  if (users.some((u) => u.email === email)) {
    return { success: false, error: "Este email já está cadastrado" }
  }

  // Validate password length
  if (password.length < 6) {
    return { success: false, error: "A senha deve ter pelo menos 6 caracteres" }
  }

  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password: simpleHash(password),
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  // Auto login after signup
  setCurrentUser(newUser)

  return { success: true }
}

export function loginUser(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers()
  const hashedPassword = simpleHash(password)

  const user = users.find((u) => u.email === email && u.password === hashedPassword)

  if (!user) {
    return { success: false, error: "Email ou senha incorretos" }
  }

  setCurrentUser(user)
  return { success: true }
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(CURRENT_USER_KEY)
  return data ? JSON.parse(data) : null
}

function setCurrentUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null
}
