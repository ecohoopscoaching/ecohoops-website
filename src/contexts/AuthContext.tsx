import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '../lib/firebase'
import { User, onAuthStateChanged } from 'firebase/auth'

interface AuthContextType {
  currentUser: User | null
  isAdmin: boolean
  loading: boolean
  loginMockAdmin: () => void
  logoutMockAdmin: () => void
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  loading: true,
  loginMockAdmin: () => {},
  logoutMockAdmin: () => {}
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
  const [isMockAdmin, setIsMockAdmin] = useState(localStorage.getItem('mock_admin') === 'true')

  // In a full production app, 'role' would be explicitly fetched from Firestore documents.
  // For this prototype setup where we only want to protect tools from public viewers, 
  // any successfully authenticated user via Firebase is granted 'admin' rights.
  const isAdmin = currentUser !== null || isMockAdmin

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
      setLoading(false)
    })

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  const loginMockAdmin = () => {
    localStorage.setItem('mock_admin', 'true')
    setIsMockAdmin(true)
  }

  const logoutMockAdmin = () => {
    localStorage.removeItem('mock_admin')
    setIsMockAdmin(false)
  }

  const value = {
    currentUser,
    isAdmin,
    loading,
    loginMockAdmin,
    logoutMockAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
