import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '../lib/firebase'
import { User, onAuthStateChanged } from 'firebase/auth'
import { UserRole, UserProfile } from '../types'

interface AuthContextType {
  currentUser: User | null
  userProfile: UserProfile | null
  userRole: UserRole | null
  isAdmin: boolean
  isCoach: boolean
  isParent: boolean
  isPlayer: boolean
  isTeamMember: boolean
  loading: boolean
  loginAsRole: (role: UserRole, profileDetails?: Partial<UserProfile>) => void
  loginMockAdmin: () => void
  logoutMockAdmin: () => void
  logout: () => void
  unlockWithPasscode: (code: string) => boolean
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
    name: 'Coach Adrian',
    email: 'coach.adrian@ecohoops.ca',
    role: 'coach',
    teamId: 'u14-girls-ss26'
  },
  parent: {
    id: 'parent-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'parent',
    childName: 'Maya Jenkins',
    teamId: 'u14-girls-ss26',
    children: [
      { id: 'child-1', name: 'Maya Jenkins', teamId: 'u14-girls-ss26', number: 7 },
      { id: 'child-2', name: 'Leo Jenkins', teamId: 'u15-boys-ss26', number: 12 }
    ]
  },
  player: {
    id: 'player-1',
    name: 'Jacob Sagat',
    email: 'jacob.sagat@ecohoops.ca',
    role: 'player',
    teamId: 'u15-boys-ss26',
    playerId: 'b7-ss'
  }
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  userRole: null,
  isAdmin: false,
  isCoach: false,
  isParent: false,
  isPlayer: false,
  isTeamMember: false,
  loading: true,
  loginAsRole: () => {},
  loginMockAdmin: () => {},
  logoutMockAdmin: () => {},
  logout: () => {},
  unlockWithPasscode: () => false
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

  // Check if device already has WhatsApp secret link access saved or in URL
  const checkInitialSecretAccess = () => {
    if (typeof window === 'undefined') return false
    if (localStorage.getItem('ecohoops_whatsapp_access') === 'true') return true
    const params = new URLSearchParams(window.location.search)
    const accessKey = params.get('access') || params.get('key') || params.get('token') || params.get('pass')
    if (accessKey && ['team', 'ecohoops', 'members', 'ss26', 'rep', 'ecohoops2026'].includes(accessKey.toLowerCase())) {
      localStorage.setItem('ecohoops_whatsapp_access', 'true')
      return true
    }
    return false
  }

  const initialSecretPass = checkInitialSecretAccess()
  const [hasSecretPass, setHasSecretPass] = useState<boolean>(initialSecretPass)

  const savedRole = (localStorage.getItem('ecohoops_user_role') as UserRole) || 
    (localStorage.getItem('mock_admin') === 'true' ? 'admin' : (initialSecretPass ? 'parent' : null))
  const savedProfile = localStorage.getItem('ecohoops_user_profile')

  const [userRole, setUserRole] = useState<UserRole | null>(savedRole || (initialSecretPass ? 'parent' : null))
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (savedProfile && savedRole) {
      try {
        return JSON.parse(savedProfile)
      } catch {
        return DEFAULT_PROFILES[savedRole] || null
      }
    }
    if (savedRole && DEFAULT_PROFILES[savedRole]) {
      return DEFAULT_PROFILES[savedRole]
    }
    if (initialSecretPass) {
      return DEFAULT_PROFILES.parent
    }
    return null
  })

  const isTeamMember = !!(userRole || currentUser || hasSecretPass)
  const isAdmin = userRole === 'admin' || currentUser !== null
  const isCoach = userRole === 'coach'
  const isParent = userRole === 'parent' || (hasSecretPass && !userRole)
  const isPlayer = userRole === 'player'

  // Listen for secret URL access parameters dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const accessKey = params.get('access') || params.get('key') || params.get('token') || params.get('pass')
      if (accessKey && ['team', 'ecohoops', 'members', 'ss26', 'rep', 'ecohoops2026'].includes(accessKey.toLowerCase())) {
        localStorage.setItem('ecohoops_whatsapp_access', 'true')
        setHasSecretPass(true)
        if (!userRole) {
          setUserRole('parent')
          setUserProfile(DEFAULT_PROFILES.parent)
          localStorage.setItem('ecohoops_user_role', 'parent')
          localStorage.setItem('ecohoops_user_profile', JSON.stringify(DEFAULT_PROFILES.parent))
        }
      }
    }
  }, [userRole])

  const unlockWithPasscode = (code: string): boolean => {
    const normalized = code.trim().toLowerCase()
    if (['team', 'ecohoops', 'members', 'ss26', 'rep', 'ecohoops2026'].includes(normalized)) {
      localStorage.setItem('ecohoops_whatsapp_access', 'true')
      setHasSecretPass(true)
      if (!userRole) {
        setUserRole('parent')
        setUserProfile(DEFAULT_PROFILES.parent)
        localStorage.setItem('ecohoops_user_role', 'parent')
        localStorage.setItem('ecohoops_user_profile', JSON.stringify(DEFAULT_PROFILES.parent))
      }
      return true
    }
    return false
  }

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
    localStorage.removeItem('ecohoops_whatsapp_access')
    setHasSecretPass(false)
    setUserRole(null)
    setUserProfile(null)
  }

  const value = {
    currentUser,
    userProfile,
    userRole,
    isAdmin,
    isCoach,
    isParent,
    isPlayer,
    isTeamMember,
    loading,
    loginAsRole,
    loginMockAdmin,
    logoutMockAdmin,
    logout,
    unlockWithPasscode
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
