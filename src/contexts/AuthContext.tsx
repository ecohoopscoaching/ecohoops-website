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
  scopedTeamId: string | null
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
    name: 'Coach Adrian',
    email: 'coach.adrian@ecohoops.ca',
    role: 'coach',
    teamId: 'u14-girls-ss26'
  },
  parent: {
    id: 'parent-1',
    name: 'Team Family',
    email: 'parent@ecohoops.ca',
    role: 'parent',
    childName: 'Maya Jenkins',
    teamId: 'u14-girls-ss26',
    children: [
      { id: 'g1-ss', name: 'Alisha Sapp', teamId: 'u14-girls-ss26', number: 3 },
      { id: 'b7-ss', name: 'Jacob Sagat', teamId: 'u15-boys-ss26', number: 7 }
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
  scopedTeamId: null,
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

  // Check if device already has WhatsApp secret link access saved or in URL (with Girls / Boys scoping)
  const checkInitialSecretAccess = (): { hasAccess: boolean; scopedTeam: string | null } => {
    if (typeof window === 'undefined') return { hasAccess: false, scopedTeam: null }
    
    let scoped: string | null = localStorage.getItem('ecohoops_scoped_team') || null
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token === 'G_7mA2qX9bV4cK8hP3nF6t') {
      scoped = 'u14-girls-ss26'
      localStorage.setItem('ecohoops_whatsapp_access', 'true')
      localStorage.setItem('ecohoops_scoped_team', scoped)
      return { hasAccess: true, scopedTeam: scoped }
    }

    if (token === 'B_3xY9k2Lp5vQ8rN4jC7zW') {
      scoped = 'u15-boys-ss26'
      localStorage.setItem('ecohoops_whatsapp_access', 'true')
      localStorage.setItem('ecohoops_scoped_team', scoped)
      return { hasAccess: true, scopedTeam: scoped }
    }

    const savedAccess = localStorage.getItem('ecohoops_whatsapp_access') === 'true'
    return { hasAccess: savedAccess, scopedTeam: scoped }
  }

  const initialAccess = checkInitialSecretAccess()
  const [hasSecretPass, setHasSecretPass] = useState<boolean>(initialAccess.hasAccess)
  const [scopedTeamId, setScopedTeamId] = useState<string | null>(initialAccess.scopedTeam)

  const savedRole = (localStorage.getItem('ecohoops_user_role') as UserRole) || 
    (localStorage.getItem('mock_admin') === 'true' ? 'admin' : (initialAccess.hasAccess ? 'parent' : null))
  const savedProfile = localStorage.getItem('ecohoops_user_profile')

  const [userRole, setUserRole] = useState<UserRole | null>(savedRole || (initialAccess.hasAccess ? 'parent' : null))
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
    if (initialAccess.hasAccess) {
      if (initialAccess.scopedTeam === 'u14-girls-ss26') {
        return {
          id: 'parent-girls',
          name: 'Girls Team Family',
          email: 'family@ecohoops.ca',
          role: 'parent',
          childName: 'Alisha Sapp',
          teamId: 'u14-girls-ss26',
          children: [{ id: 'g1-ss', name: 'Alisha Sapp', teamId: 'u14-girls-ss26', number: 3 }]
        }
      }
      if (initialAccess.scopedTeam === 'u15-boys-ss26') {
        return {
          id: 'parent-boys',
          name: 'Boys Team Family',
          email: 'family@ecohoops.ca',
          role: 'parent',
          childName: 'Jacob Sagat',
          teamId: 'u15-boys-ss26',
          children: [{ id: 'b7-ss', name: 'Jacob Sagat', teamId: 'u15-boys-ss26', number: 7 }]
        }
      }
      return DEFAULT_PROFILES.parent
    }
    return null
  })

  const isTeamMember = !!(userRole || currentUser || hasSecretPass)
  const isAdmin = userRole === 'admin' || currentUser !== null
  const isCoach = userRole === 'coach'
  const isParent = userRole === 'parent' || (hasSecretPass && !userRole)
  const isPlayer = userRole === 'player'

  // Listen for secret URL access parameters dynamically (Girls, Boys, or general team)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')

      if (token === 'G_7mA2qX9bV4cK8hP3nF6t') {
        localStorage.setItem('ecohoops_whatsapp_access', 'true')
        localStorage.setItem('ecohoops_scoped_team', 'u14-girls-ss26')
        setScopedTeamId('u14-girls-ss26')
        setHasSecretPass(true)
        if (!userRole || userRole === 'parent') {
          const profile: UserProfile = {
            id: 'parent-girls',
            name: 'Girls Team Family',
            email: 'family@ecohoops.ca',
            role: 'parent',
            childName: 'Alisha Sapp',
            teamId: 'u14-girls-ss26',
            children: [{ id: 'g1-ss', name: 'Alisha Sapp', teamId: 'u14-girls-ss26', number: 3 }]
          }
          setUserRole('parent')
          setUserProfile(profile)
          localStorage.setItem('ecohoops_user_role', 'parent')
          localStorage.setItem('ecohoops_user_profile', JSON.stringify(profile))
        }
      } else if (token === 'B_3xY9k2Lp5vQ8rN4jC7zW') {
        localStorage.setItem('ecohoops_whatsapp_access', 'true')
        localStorage.setItem('ecohoops_scoped_team', 'u15-boys-ss26')
        setScopedTeamId('u15-boys-ss26')
        setHasSecretPass(true)
        if (!userRole || userRole === 'parent') {
          const profile: UserProfile = {
            id: 'parent-boys',
            name: 'Boys Team Family',
            email: 'family@ecohoops.ca',
            role: 'parent',
            childName: 'Jacob Sagat',
            teamId: 'u15-boys-ss26',
            children: [{ id: 'b7-ss', name: 'Jacob Sagat', teamId: 'u15-boys-ss26', number: 7 }]
          }
          setUserRole('parent')
          setUserProfile(profile)
          localStorage.setItem('ecohoops_user_role', 'parent')
          localStorage.setItem('ecohoops_user_profile', JSON.stringify(profile))
        }
      }
    }
  }, [userRole])

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
    localStorage.removeItem('ecohoops_scoped_team')
    localStorage.removeItem('ecohoops_parent_player_id')
    setHasSecretPass(false)
    setScopedTeamId(null)
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
    scopedTeamId,
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
