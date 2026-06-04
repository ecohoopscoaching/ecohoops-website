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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMockAdmin, setIsMockAdmin] = useState(localStorage.getItem('mock_admin') === 'true')

  // In a full production app, 'role' would be explicitly fetched from Firestore documents.
  // For this prototype setup where we only want to protect tools from public viewers, 
  // any successfully authenticated user via Firebase is granted 'admin' rights.
  const isAdmin = currentUser !== null || isMockAdmin

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
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
