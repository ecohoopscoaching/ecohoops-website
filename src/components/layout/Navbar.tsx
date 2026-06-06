import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface NavLinkItem {
  label: string;
  path: string;
  dropdown?: { label: string; path: string }[];
}

const NAV_LINKS: NavLinkItem[] = [
  { label: 'Home', path: '/' },
  { label: 'EcoHoops for Kids', path: '/nonprofit' },
  { label: 'All Girls', path: '/girls' },
  { label: 'EcoHoops Jr.', path: '/jr' },
  { 
    label: 'Rep Teams', 
    path: '/rep',
    dropdown: [
      { label: 'Divisions & Fees', path: '/rep' },
      { label: 'Rosters & Player Stats', path: '/teams' }
    ]
  },
  { 
    label: 'About', 
    path: '/about',
    dropdown: [
      { label: 'Our Journey', path: '/about' },
      { label: 'Scientific Philosophy', path: '/philosophy' }
    ]
  },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null)
  const [mobileExpandedLink, setMobileExpandedLink] = useState<string | null>(null)
  const location = useLocation()
  const { isAdmin } = useAuth()

  const activeLinks = isAdmin 
    ? [...NAV_LINKS, { label: 'Admin', path: '/admin' }]
    : NAV_LINKS

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    // Prevent scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          scrolled || isOpen
            ? 'bg-eco-black/90 backdrop-blur-xl border-b border-eco-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-24">
            
            {/* Desktop Navigation (Centered Direct Tabs) */}
            <div 
              className="hidden lg:flex items-center justify-center w-full gap-x-2 xl:gap-x-4"
              onMouseLeave={() => {
                setHoveredPath(null)
                setHoveredDropdown(null)
              }}
            >
              {activeLinks.map((link) => (
                <div
                  key={link.path}
                  className="relative py-4"
                  onMouseEnter={() => {
                    setHoveredPath(link.path)
                    if (link.dropdown) setHoveredDropdown(link.path)
                    else setHoveredDropdown(null)
                  }}
                  onMouseLeave={() => {
                    if (link.dropdown) setHoveredDropdown(null)
                  }}
                >
                  <Link
                    to={link.path}
                    className={`relative px-4 py-2 font-display text-lg xl:text-xl tracking-wider uppercase transform-gpu will-change-transform transition-colors duration-300 ease-out flex items-center gap-1 ${
                      location.pathname === link.path || (link.dropdown && link.dropdown.some(s => location.pathname === s.path))
                        ? 'text-[#97B3D2]'
                        : 'text-white hover:text-[#97B3D2]'
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {link.dropdown && (
                      <ChevronDown 
                        size={14} 
                        className={`relative z-10 transition-transform duration-300 ${
                          hoveredDropdown === link.path ? 'rotate-180 text-[#97B3D2]' : 'text-white/70'
                        }`} 
                      />
                    )}
                    {hoveredPath === link.path && (
                      <motion.div
                        layoutId="navbar-hover-pill"
                        className="absolute inset-0 bg-[#97B3D2]/[0.07] border border-[#97B3D2]/[0.15] rounded-full z-0 shadow-[0_0_20px_rgba(151,179,210,0.1)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {(location.pathname === link.path || (link.dropdown && link.dropdown.some(s => location.pathname === s.path))) && (
                      <motion.div
                        layoutId="navbar-active-underline"
                        className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#97B3D2] z-0 shadow-[0_0_12px_rgba(151,179,210,0.8)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>

                  <AnimatePresence>
                    {link.dropdown && hoveredDropdown === link.path && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 z-50 pointer-events-auto"
                      >
                        <div className="bg-eco-surface/95 backdrop-blur-xl border border-eco-border rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_30px_rgba(151,179,210,0.05)] flex flex-col gap-1">
                          {link.dropdown.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`px-3 py-2 text-sm font-heading rounded-r-lg transition-all duration-200 border-l-2 ${
                                location.pathname === subItem.path
                                  ? 'text-[#97B3D2] bg-[#97B3D2]/[0.08] border-[#97B3D2] pl-4'
                                  : 'text-white/80 hover:text-white hover:bg-[#97B3D2]/10 border-transparent hover:border-[#97B3D2] hover:pl-4 pl-3'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Mobile Navigation Header */}
            <div className="flex lg:hidden items-center justify-between w-full h-full">
              {/* Menu Toggle */}
              <div className="flex items-center z-10">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative flex items-center gap-3 group px-5 py-2 rounded-full bg-eco-black/40 border border-white/10 hover:border-eco-blue/50 hover:bg-eco-black/60 hover:shadow-[0_0_20px_rgba(151,179,210,0.15)] backdrop-blur-md transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                  
                  <span className="font-heading font-bold text-xs tracking-[0.2em] uppercase text-white group-hover:text-[#97B3D2] transition-colors">
                    {isOpen ? 'Close' : 'Menu'}
                  </span>
                  
                  <div className="text-white group-hover:text-[#97B3D2] transition-colors flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X size={16} strokeWidth={2.5} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu size={16} strokeWidth={2.5} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </div>

              {/* Center Brand Text Logo */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <Link 
                  to="/" 
                  className="font-display text-3xl uppercase tracking-wide text-white hover:text-[#97B3D2] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  ECOHOOPS
                </Link>
              </div>

              {/* Empty Right Spacer for alignment */}
              <div className="w-[100px] flex justify-end pointer-events-none"></div>
            </div>

          </div>
        </div>
      </motion.nav>

      {/* Immersive Full-Screen Overlay for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-eco-black/98 backdrop-blur-2xl overflow-y-auto lg:hidden"
          >
            <div className="min-h-screen flex items-center justify-center pt-28 pb-12 px-6">
              <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
                
                {/* Navigation Links */}
                <div className="flex flex-col items-center gap-4 w-full">
                  {activeLinks.map((link, i) => {
                    const isExpanded = mobileExpandedLink === link.path
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                        className="w-full text-center"
                      >
                        {link.dropdown ? (
                          <div className="w-full">
                            <button
                              onClick={() => setMobileExpandedLink(isExpanded ? null : link.path)}
                              className="group inline-block w-full py-2 focus:outline-none"
                            >
                              <div className="flex items-center justify-center gap-4">
                                <span className="text-sm font-mono text-eco-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  0{i + 1}
                                </span>
                                <span className={`font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide transform-gpu will-change-transform transition-[transform,color] duration-300 ease-out flex items-center gap-2 ${
                                  location.pathname === link.path || link.dropdown.some(s => location.pathname === s.path)
                                    ? 'text-[#97B3D2] drop-shadow-[0_0_15px_rgba(151,179,210,0.4)]'
                                    : 'text-white hover:text-[#97B3D2]'
                                }`}>
                                  {link.label}
                                  <ChevronDown 
                                    size={24} 
                                    className={`transition-transform duration-300 ${
                                      isExpanded ? 'rotate-180 text-[#97B3D2]' : 'text-white/50'
                                    }`} 
                                  />
                                </span>
                              </div>
                            </button>
                            
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                                  className="overflow-hidden bg-[#97B3D2]/[0.02] border border-white/5 rounded-2xl mt-2 flex flex-col items-center gap-1 py-2"
                                >
                                  {link.dropdown.map((subItem) => (
                                    <Link
                                      key={subItem.path}
                                      to={subItem.path}
                                      onClick={() => setIsOpen(false)}
                                      className={`font-heading text-lg sm:text-xl py-2 uppercase tracking-widest transition-colors duration-200 ${
                                        location.pathname === subItem.path
                                          ? 'text-[#97B3D2] font-semibold'
                                          : 'text-white/70 hover:text-white'
                                      }`}
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className="group inline-block w-full py-2"
                          >
                            <div className="flex items-center justify-center gap-4">
                              <span className="text-sm font-mono text-eco-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                0{i + 1}
                              </span>
                              <span className={`font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide transform-gpu will-change-transform transition-[transform,color] duration-300 ease-out ${
                                location.pathname === link.path
                                  ? 'text-[#97B3D2] drop-shadow-[0_0_15px_rgba(151,179,210,0.4)]'
                                  : 'text-white hover:text-[#97B3D2] hover:scale-105'
                              }`}>
                                {link.label}
                              </span>
                            </div>
                          </Link>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Bottom Utilities */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-16 pt-8 border-t border-eco-border/50 w-full max-w-lg flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-6 text-sm font-mono uppercase tracking-wider text-eco-muted">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#97B3D2] transition-colors">Instagram</a>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#97B3D2] transition-colors">YouTube</a>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <Link to="/login" className="text-sm font-heading font-bold uppercase tracking-widest text-eco-muted-light hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                      Member Login
                    </Link>
                    <Link to="/register" className="btn-glow !px-5 !py-2 text-xs" onClick={() => setIsOpen(false)}>
                      Join Now
                    </Link>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
