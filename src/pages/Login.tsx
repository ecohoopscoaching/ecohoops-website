import { useState } from 'react'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Lock, LogOut, ArrowRight, User as UserIcon } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { currentUser, isAdmin, loginMockAdmin, logoutMockAdmin } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // For prototyping without real keys, block submission visually
    if (import.meta.env.VITE_FIREBASE_API_KEY === "dummy_api_key" || !import.meta.env.VITE_FIREBASE_API_KEY) {
      alert("Please update your .env environment variables with your real Firebase Project credentials to connect to Auth. Authentication block is temporarily enabled.")
      setLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError('Failed to securely log in. Check your credentials.')
      console.error(err)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await signOut(auth)
    logoutMockAdmin()
    navigate('/')
  }

  function handleMockLogin() {
    loginMockAdmin()
    navigate('/admin')
  }

  return (
    <div className="pt-28 pb-20 min-h-screen flex items-center justify-center p-6">
      <div className="glow-card w-full max-w-md p-8 md:p-10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-eco-orange/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="mb-10 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-eco-surface2 border border-eco-border flex items-center justify-center mx-auto mb-6">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="font-display flex flex-col text-3xl uppercase tracking-tight text-white mb-2">
            Secure <span className="text-eco-orange text-4xl">Gateway</span>
          </h1>
          <p className="text-eco-muted-light text-sm">
            Admin & Coach internal access point.
          </p>
        </div>

        {(currentUser || isAdmin) ? (
          <div className="text-center relative z-10 space-y-6">
            <div className="p-6 rounded-2xl bg-eco-surface2 border border-eco-orange/30">
              <UserIcon size={32} className="mx-auto text-eco-orange mb-3" />
              <p className="text-white font-medium mb-1">Session Active</p>
              <p className="text-xs text-eco-muted mb-4">{currentUser?.email || 'Prototype Admin (Bypass)'}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-orange/20 text-eco-orange text-xs font-mono uppercase tracking-widest font-bold">
                Level: Administrator
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-transparent border border-eco-border hover:border-red-500/50 hover:bg-red-500/10 text-eco-muted hover:text-red-400 rounded-xl transition-all duration-300 font-heading font-bold text-sm tracking-wider uppercase"
            >
              Sign Out Securely <LogOut size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-eco-muted mb-2">
                Authorized Email
              </label>
              <input
                type="email"
                required
                className="input-field w-full shadow-inner bg-eco-surface/50"
                placeholder="coach@ecohoops.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-eco-muted mb-2">
                Access Passcode
              </label>
              <input
                type="password"
                required
                className="input-field w-full shadow-inner bg-eco-surface/50"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              disabled={loading}
              type="submit"
              className="btn-glow w-full flex items-center justify-center gap-2 mt-4 py-4"
            >
              {loading ? 'Authenticating...' : 'Establish Connection'} 
              {!loading && <ArrowRight size={18} />}
            </button>

            <div className="pt-6 mt-6 border-t border-eco-border">
              <button
                type="button"
                onClick={handleMockLogin}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-eco-surface2 border border-eco-border hover:border-eco-orange/50 hover:bg-eco-orange/10 text-eco-muted hover:text-eco-orange rounded-xl transition-all duration-300 font-heading font-bold text-sm tracking-wider uppercase"
              >
                Prototype Bypass (Admin)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
