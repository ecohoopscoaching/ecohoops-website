import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Youtube, Mail, MapPin, ArrowUpRight, Loader2, CheckCircle2 } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Program',
    links: [
      { label: 'Philosophy', path: '/philosophy' },
      { label: 'Teams', path: '/teams' },
      { label: 'Schedule', path: '/schedule' },
      { label: 'Register', path: '/register' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'AI Coach', path: '/dashboard' },
      { label: 'Team Chat', path: '/dashboard' },
      { label: 'Stats', path: '/dashboard' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Friday Night Hoops', path: '/schedule' },
      { label: 'Book Club', path: '/philosophy' },
      { label: 'Nonprofit', path: '/nonprofit' },
      { label: 'Contact', path: '/register' },
    ],
  },
]

const SOCIALS = [
  { icon: Instagram, href: 'https://instagram.com/ecohoopsbasketball', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/eco_hoops', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Mail, href: 'mailto:info@ecohoops.ca', label: 'Email' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('submitting')
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "933bf5e4-2815-45e1-853f-a58c9fb77a2f",
          subject: "New EcoHoops Newsletter Subscriber!",
          Email: email,
          from_name: "EcoHoops Website",
        }),
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success')
        setEmail('')
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <footer className="relative border-t border-eco-border">
      {/* Gradient glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-eco-orange/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <img 
                src="/images/logo.png" 
                alt="EcoHoops Logo" 
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="font-display text-2xl tracking-tight">
                ECO<span className="text-eco-orange">HOOPS</span>
              </span>
            </Link>
            <p className="text-eco-muted-light text-sm leading-relaxed mb-6 max-w-sm">
              The Anti-Elite Basketball Movement. Building people, not just pros.
              Basketball is just the tool.
            </p>
            <div className="flex items-center gap-1 text-eco-muted text-sm mb-6">
              <MapPin size={14} />
              <span>Mississauga</span>
            </div>
            <div className="flex gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-eco-surface border border-eco-border flex items-center justify-center text-eco-muted hover:text-eco-orange hover:border-eco-orange/30 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-eco-muted-light hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-eco-muted-light mb-4">
              Get the latest from the movement.
            </p>
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-eco-orange/10 border border-eco-orange/20 rounded-xl p-3 flex items-center gap-2"
              >
                <CheckCircle2 className="text-eco-orange" size={16} />
                <span className="text-xs text-white">Thanks for subscribing!</span>
              </motion.div>
            ) : (
              <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === 'submitting'}
                  className="input-field text-sm !py-2.5"
                />
                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-glow !px-4 !py-2.5 text-xs w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    <><Loader2 size={14} className="animate-spin" /> Subscribing...</>
                  ) : (
                    'Subscribe'
                  )}
                </button>
                {status === 'error' && (
                  <p className="text-[10px] text-red-400">Something went wrong. Try again.</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-eco-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-eco-muted">
            &copy; 2026 EcoHoops Inc. All rights reserved. 
            <Link to="/login" className="ml-2 hover:text-eco-orange/50 transition-colors opacity-30">Admin</Link>
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-eco-muted">Built with</span>
            <span className="text-eco-orange text-xs">&#9829;</span>
            <span className="text-xs text-eco-muted">for the culture</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
