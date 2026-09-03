import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '../lib/firebase'
import { User, onAuthStateChanged } from 'firebase/auth'
import { UserRole, UserProfile } from '../types'

interface AuthContextType {
  currentUser: User | null
  userProfile: UserProfile | null
  userRole: UserRole
  isAdmin: boolean
  isCoach: boolean
  isParent: boolean
  isPlayer: boolean
  loading: boolean
  loginAsRole: (role: UserRole, profileDetails?: Partial<UserProfile>) => void
  loginMockAdmin: () => void
  logoutMockAdmin: () => void
  logout: () => void
}

const DEFAULT_PROFILES: Record<UserRole, UserProfile> = {
  admin: {
    id: 'admin-1',
    name: 'Head Coach / Admin',
    email: 'admin@ecohoops.ca',
    role: 'admin',
  },
  coach: {
    id: 'coach-1',
    name: 'Coach Marcus',
    email: 'coach@ecohoops.ca',
    role: 'coach',
    teamId: 'u15-boys'
  },
  parent: {
    id: 'parent-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'parent',
    childName: 'Maya Jenkins',
    teamId: 'u14-girls',
    children: [
      { id: 'child-1', name: 'Maya Jenkins', teamId: 'u14-girls', number: 7 },
      { id: 'child-2', name: 'Leo Jenkins', teamId: 'u15-boys', number: 12 }
    ]
  },
  player: {
    id: 'player-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@ecohoops.ca',
    role: 'player',
    teamId: 'u15-boys',
    playerId: 'p1'
  }
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  userRole: 'player',
  isAdmin: false,
  isCoach: false,
  isParent: false,
  isPlayer: true,
  loading: true,
  loginAsRole: () => {},
  loginMockAdmin: () => {},
  logoutMockAdmin: () => {},
  logout: () => {}
})

export function useAuth() {
  return useContext(AuthContext)
}

const isFirebaseConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  return !!(
    apiKey && 
    apiKey !== "" && 
    apiKey !== "dummy_api_key" && 
    projectId && 
    projectId !== "" && 
    projectId !== "dummy_project_id"
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const savedRole = (localStorage.getItem('ecohoops_user_role') as UserRole) || (localStorage.getItem('mock_admin') === 'true' ? 'admin' : null)
  const savedProfile = localStorage.getItem('ecohoops_user_profile')

  const [userRole, setUserRole] = useState<UserRole>(savedRole || 'player')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile)
      } catch {
        return DEFAULT_PROFILES[userRole || 'player']
      }
    }
    return DEFAULT_PROFILES[userRole || 'player']
  })

  const isAdmin = userRole === 'admin' || currentUser !== null
  const isCoach = userRole === 'coach'
  const isParent = userRole === 'parent'
  const isPlayer = userRole === 'player'

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false)
      return
    }

    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1000)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout)
      setCurrentUser(user)
      if (user) {
        setUserRole('admin')
      }
      setLoading(false)
    })

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  const loginAsRole = (role: UserRole, profileDetails?: Partial<UserProfile>) => {
    const baseProfile = DEFAULT_PROFILES[role] || DEFAULT_PROFILES.player
    const updatedProfile: UserProfile = { ...baseProfile, ...profileDetails, role }
    
    setUserRole(role)
    setUserProfile(updatedProfile)
    localStorage.setItem('ecohoops_user_role', role)
    localStorage.setItem('ecohoops_user_profile', JSON.stringify(updatedProfile))
    
    if (role === 'admin') {
      localStorage.setItem('mock_admin', 'true')
    } else {
      localStorage.removeItem('mock_admin')
    }
  }

  const loginMockAdmin = () => {
    loginAsRole('admin')
  }

  const logoutMockAdmin = () => {
    logout()
  }

  const logout = () => {
    localStorage.removeItem('mock_admin')
    localStorage.removeItem('ecohoops_user_role')
    localStorage.removeItem('ecohoops_user_profile')
    setUserRole('player')
    setUserProfile(DEFAULT_PROFILES.player)
  }

  const value = {
    currentUser,
    userProfile,
    userRole,
    isAdmin,
    isCoach,
    isParent,
    isPlayer,
    loading,
    loginAsRole,
    loginMockAdmin,
    logoutMockAdmin,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
