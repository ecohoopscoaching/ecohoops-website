import { useState } from 'react'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Lock, LogOut, ArrowRight, User as UserIcon, Shield, HeartHandshake, Dribbble } from 'lucide-react'
import { UserRole } from '../types'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('player')
  const { currentUser, userProfile, userRole, loginAsRole, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (import.meta.env.VITE_FIREBASE_API_KEY === "dummy_api_key" || !import.meta.env.VITE_FIREBASE_API_KEY) {
      // Prototype demo fallback
      loginAsRole(selectedRole, { email })
      navigate('/dashboard')
      setLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      loginAsRole(selectedRole, { email })
      navigate('/dashboard')
    } catch (err: any) {
      setError('Failed to securely log in. Check your credentials.')
      console.error(err)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await signOut(auth)
    logout()
    navigate('/')
  }

  function handleDemoRoleLogin(role: UserRole) {
    loginAsRole(role)
    if (role === 'admin' || role === 'coach') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="pt-28 pb-20 min-h-screen flex items-center justify-center p-6 bg-eco-black text-white font-body">
      <div className="glow-card w-full max-w-lg p-8 md:p-10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-eco-orange/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="mb-8 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-eco-surface2 border border-eco-border flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-eco-orange" />
          </div>
          <h1 className="font-display flex flex-col text-3xl uppercase tracking-tight text-white mb-2">
            EcoHoops <span className="text-eco-orange text-4xl">Portal</span>
          </h1>
          <p className="text-eco-muted-light text-xs font-mono uppercase tracking-wider">
            Select your account type to sign in
          </p>
        </div>

        {currentUser || userProfile ? (
          <div className="text-center relative z-10 space-y-6">
            <div className="p-6 rounded-2xl bg-eco-surface2 border border-eco-orange/30 text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-eco-orange/20 border border-eco-orange/40 flex items-center justify-center text-eco-orange">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base">{userProfile?.name}</h3>
                  <p className="text-xs text-eco-muted font-mono">{userProfile?.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-eco-muted">Active Role:</span>
                <span className="px-3 py-1 rounded-full bg-eco-orange/20 text-eco-orange font-mono uppercase font-bold tracking-wider text-[11px]">
                  {userRole}
                </span>
              </div>

              {userProfile?.childName && (
                <div className="text-xs text-eco-muted font-mono pt-1">
                  Child: <span className="text-white font-semibold">{userProfile.childName}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="py-3 px-4 bg-eco-orange text-eco-black font-heading font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-eco-orange/90 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-transparent border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-eco-muted hover:text-red-400 rounded-xl transition-all font-heading font-bold text-xs uppercase tracking-wider"
              >
                Sign Out <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Role Switcher Tabs */}
            <div>
              <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('player')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedRole === 'player'
                      ? 'bg-eco-orange/20 border-eco-orange text-white'
                      : 'bg-eco-surface border-white/10 text-eco-muted hover:text-white'
                  }`}
                >
                  <Dribbble size={18} className={selectedRole === 'player' ? 'text-eco-orange' : ''} />
                  <span className="text-xs font-bold font-heading uppercase">Player</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('parent')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedRole === 'parent'
                      ? 'bg-eco-blue/20 border-eco-blue text-white'
                      : 'bg-eco-surface border-white/10 text-eco-muted hover:text-white'
                  }`}
                >
                  <HeartHandshake size={18} className={selectedRole === 'parent' ? 'text-eco-blue' : ''} />
                  <span className="text-xs font-bold font-heading uppercase">Parent</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedRole === 'admin'
                      ? 'bg-purple-500/20 border-purple-500 text-white'
                      : 'bg-eco-surface border-white/10 text-eco-muted hover:text-white'
                  }`}
                >
                  <Shield size={18} className={selectedRole === 'admin' ? 'text-purple-400' : ''} />
                  <span className="text-xs font-bold font-heading uppercase">Coach</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-eco-muted mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="input-field w-full shadow-inner bg-eco-surface/50 text-xs"
                placeholder={selectedRole === 'player' ? 'player@ecohoops.ca' : selectedRole === 'parent' ? 'parent@example.com' : 'coach@ecohoops.ca'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-eco-muted mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="input-field w-full shadow-inner bg-eco-surface/50 text-xs"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="btn-glow w-full flex items-center justify-center gap-2 mt-4 py-3.5 text-xs font-bold uppercase font-heading tracking-wider"
            >
              {loading ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}
              {!loading && <ArrowRight size={16} />}
            </button>

            {/* Quick Demo Account Launchers */}
            <div className="pt-5 border-t border-white/10">
              <p className="text-[11px] font-mono text-center text-eco-muted mb-3 uppercase tracking-wider">
                Instant Demo Access
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoRoleLogin('player')}
                  className="py-2.5 px-2 bg-eco-surface border border-white/10 hover:border-eco-orange/50 hover:bg-eco-orange/10 text-eco-muted hover:text-eco-orange rounded-xl text-[11px] font-heading font-bold uppercase transition-all"
                >
                  🏀 Player Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoRoleLogin('parent')}
                  className="py-2.5 px-2 bg-eco-surface border border-white/10 hover:border-eco-blue/50 hover:bg-eco-blue/10 text-eco-muted hover:text-eco-blue rounded-xl text-[11px] font-heading font-bold uppercase transition-all"
                >
                  👪 Parent Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoRoleLogin('admin')}
                  className="py-2.5 px-2 bg-eco-surface border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 text-eco-muted hover:text-purple-400 rounded-xl text-[11px] font-heading font-bold uppercase transition-all"
                >
                  👑 Coach Demo
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
