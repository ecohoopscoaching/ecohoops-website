import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AnnouncementBar from '../home/AnnouncementBar'

interface NavLinkItem {
  label: string;
  path: string;
  isMega?: boolean;
  megaMenu?: {
    title: string;
    links: { label: string; path: string; description?: string }[];
  }[];
  dropdown?: { 
    label: string; 
    path: string;
    subItems?: { label: string; path: string }[];
  }[];
}

const NAV_LINKS: NavLinkItem[] = [
  { label: 'Home', path: '/' },
  { label: 'The Game Changer', path: '/game-changer/index.html' },
  { 
    label: 'Explore Programs', 
    path: '#',
    isMega: true,
    megaMenu: [
      {
        title: 'Youth Programs',
        links: [
          { label: 'EcoHoops for Kids Canada', path: '/nonprofit', description: 'Our community programs & subsidies' },
          { label: 'EcoHoops Jr.', path: '/jr', description: 'Play & learn for ages 5-11' },
          { label: 'All Girls Program', path: '/girls', description: 'Empowering spaces & female leadership' }
        ]
      },
      {
        title: 'Competitive',
        links: [
          { label: 'Rep Teams', path: '/rep', description: 'Divisions, schedules, and tryouts' },
          { label: 'Rosters & Player Stats', path: '/teams', description: 'Meet the players & track performance' },
          { label: 'Watch Videos', path: '/videos', description: 'Game highlights & team videos' }
        ]
      },
      {
        title: 'Safety & Inclusion',
        links: [
          { label: 'Safe Sport & Financial Aid', path: '/safe-sport', description: 'Athlete safety, maltreatment reporting & funding grants' }
        ]
      }
    ]
  },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' }
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [hoveredDropdownLabel, setHoveredDropdownLabel] = useState<string | null>(null)
  const [mobileExpandedLabel, setMobileExpandedLabel] = useState<string | null>(null)
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

  const isLinkActive = (link: NavLinkItem) => {
    if (location.pathname === link.path) return true
    if (link.isMega && link.megaMenu) {
      return link.megaMenu.some(col => 
        col.links.some(sub => location.pathname === sub.path)
      )
    }
    if (link.dropdown) {
      return link.dropdown.some(sub => 
        location.pathname === sub.path || 
        (sub.subItems && sub.subItems.some(child => location.pathname === child.path))
      )
    }
    return false
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 flex flex-col ${
          scrolled || isOpen
            ? 'bg-eco-black/95 backdrop-blur-xl border-b border-eco-border'
            : 'bg-eco-black/80 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none'
        }`}
      >
        {location.pathname === '/' && <AnnouncementBar />}
        <div className={`max-w-7xl mx-auto px-6 lg:px-8 w-full transition-all duration-300 ${scrolled || isOpen ? 'py-3' : 'py-4'}`}>
          <div className="relative flex items-center justify-between">
            
            {/* Desktop Brand Logo */}
            <div className="hidden lg:block flex-shrink-0">
              <Link 
                to="/" 
                className="font-display text-2xl uppercase tracking-wider text-white hover:text-[#97B3D2] transition-colors font-bold"
              >
                ECOHOOPS
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div 
              className="hidden lg:flex items-center gap-x-6 xl:gap-x-10 mx-auto"
              onMouseLeave={() => {
                setHoveredLabel(null)
                setHoveredDropdownLabel(null)
              }}
            >
              {activeLinks.map((link) => {
                const isActive = isLinkActive(link)
                return (
                  <div
                    key={link.label}
                    className="relative py-2"
                    onMouseEnter={() => {
                      setHoveredLabel(link.label)
                      if (link.dropdown || link.isMega) setHoveredDropdownLabel(link.label)
                      else setHoveredDropdownLabel(null)
                    }}
                    onMouseLeave={() => {
                      setHoveredDropdownLabel(null)
                    }}
                  >
                    {(() => {
                      const isStatic = link.path.includes('/game-changer') || link.path.endsWith('.html');
                      const linkProps = {
                        className: `relative px-1 py-1.5 font-heading text-sm tracking-wide transition-colors duration-300 ease-out flex items-center gap-1 font-medium bg-transparent border-none text-left focus:outline-none cursor-pointer ${
                          isActive
                            ? 'text-[#97B3D2]'
                            : 'text-white/80 hover:text-[#97B3D2]'
                        }`
                      };
                      const children = (
                        <>
                          <span className="relative z-10">{link.label}</span>
                          {(link.dropdown || link.isMega) && (
                            <ChevronDown 
                              size={14} 
                              className={`relative z-10 transition-transform duration-300 ${
                                hoveredDropdownLabel === link.label ? 'rotate-180 text-[#97B3D2]' : 'text-white/50'
                              }`} 
                            />
                          )}
                          {isActive && (
                            <motion.div
                              layoutId="navbar-active-underline"
                              className="absolute bottom-[-4px] left-1 right-1 h-[2px] bg-[#97B3D2] z-0 shadow-[0_0_8px_rgba(151,179,210,0.5)]"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                        </>
                      );
                      return link.path === '#' ? (
                        <button {...linkProps} onClick={(e) => e.preventDefault()}>
                          {children}
                        </button>
                      ) : isStatic ? (
                        <a href={link.path} {...linkProps}>{children}</a>
                      ) : (
                        <Link to={link.path} {...linkProps}>{children}</Link>
                      );
                    })()}

                    {/* Desktop Mega Menu Panel */}
                    <AnimatePresence>
                      {link.isMega && hoveredDropdownLabel === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[720px] z-50 pointer-events-auto"
                        >
                          <div className="bg-eco-surface/95 backdrop-blur-2xl border border-eco-border rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(151,179,210,0.08)] grid grid-cols-3 gap-8">
                            {link.megaMenu?.map((column) => (
                              <div key={column.title} className="flex flex-col gap-4">
                                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-eco-muted pb-1 border-b border-white/5">
                                  {column.title}
                                </h3>
                                <div className="flex flex-col gap-3">
                                  {column.links.map((subLink) => {
                                    const isSubStatic = subLink.path.includes('/game-changer') || subLink.path.endsWith('.html');
                                    const isSubActive = location.pathname === subLink.path;
                                    const subProps = {
                                      key: subLink.path,
                                      className: "group/item block text-left bg-transparent border-none cursor-pointer focus:outline-none w-full"
                                    };
                                    const subContent = (
                                      <div className="flex flex-col text-left">
                                        <span className={`text-sm font-heading font-semibold transition-colors duration-200 ${
                                          isSubActive ? 'text-[#97B3D2]' : 'text-white group-hover/item:text-[#97B3D2]'
                                        }`}>
                                          {subLink.label}
                                        </span>
                                        {subLink.description && (
                                          <span className="text-xs text-eco-muted/80 mt-0.5 leading-normal group-hover/item:text-white/60 transition-colors">
                                            {subLink.description}
                                          </span>
                                        )}
                                      </div>
                                    );
                                    return isSubStatic ? (
                                      <a href={subLink.path} {...subProps}>{subContent}</a>
                                    ) : (
                                      <Link to={subLink.path} {...subProps}>{subContent}</Link>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Desktop Standard Dropdown Menu */}
                    <AnimatePresence>
                      {link.dropdown && hoveredDropdownLabel === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-64 z-50 pointer-events-auto"
                        >
                          <div className="bg-eco-surface/95 backdrop-blur-xl border border-eco-border rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_30px_rgba(151,179,210,0.05)] flex flex-col gap-1">
                            {link.dropdown.map((subItem) => {
                              const isSubStatic = subItem.path.includes('/game-changer') || subItem.path.endsWith('.html');
                              const isSubActive = location.pathname === subItem.path || (subItem.subItems && subItem.subItems.some(c => location.pathname === c.path));
                              const subProps = {
                                key: subItem.path,
                                className: `px-3 py-1.5 text-xs font-heading rounded-lg transition-all duration-200 border-l-2 ${
                                  isSubActive
                                    ? 'text-[#97B3D2] bg-[#97B3D2]/[0.08] border-[#97B3D2] pl-4 font-semibold'
                                    : 'text-white/80 hover:text-white hover:bg-[#97B3D2]/10 border-transparent hover:border-[#97B3D2] hover:pl-4 pl-3'
                                }`
                              };
                              return (
                                <div key={subItem.path} className="flex flex-col gap-0.5">
                                  {isSubStatic ? (
                                    <a href={subItem.path} {...subProps}>
                                      {subItem.label}
                                    </a>
                                  ) : (
                                    <Link to={subItem.path} {...subProps}>
                                      {subItem.label}
                                    </Link>
                                  )}
                                  {subItem.subItems && (
                                    <div className="flex flex-col gap-0.5 pl-4 border-l border-white/5 ml-3 my-1">
                                      {subItem.subItems.map((child) => {
                                        const isChildStatic = child.path.includes('/game-changer') || child.path.endsWith('.html');
                                        const childProps = {
                                          key: child.path,
                                          className: `px-2 py-1 text-[11px] font-heading rounded transition-all duration-200 ${
                                            location.pathname === child.path
                                              ? 'text-[#97B3D2] font-semibold bg-[#97B3D2]/5'
                                              : 'text-white/50 hover:text-white hover:bg-white/5'
                                          }`
                                        };
                                        return isChildStatic ? (
                                          <a href={child.path} {...childProps}>{child.label}</a>
                                        ) : (
                                          <Link to={child.path} {...childProps}>{child.label}</Link>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Desktop Call-to-Action Button */}
            <div className="hidden lg:block flex-shrink-0">
              <Link 
                to="/register" 
                className="px-6 py-2.5 text-sm font-semibold rounded-full bg-[#97B3D2] text-[#060A10] hover:bg-[#B0C8E0] hover:shadow-[0_0_25px_rgba(151,179,210,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 inline-block text-center"
              >
                Register for Tryouts
              </Link>
            </div>

            {/* Mobile Navigation Header */}
            <div className="flex lg:hidden items-center justify-between w-full h-12 px-2">
              {/* Brand Text Logo on the Left */}
              <div className="flex items-center">
                <Link 
                  to="/" 
                  className="font-display text-2xl uppercase tracking-wider text-white hover:text-[#97B3D2] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  ECOHOOPS
                </Link>
              </div>

              {/* Menu Toggle on the Right */}
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
            <div className="min-h-screen flex items-start justify-center pt-28 pb-12 px-6">
              <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
                
                {/* Navigation Links */}
                <div className="flex flex-col items-center gap-4 w-full">
                  {activeLinks.map((link, i) => {
                    const isExpanded = mobileExpandedLabel === link.label
                    const isActive = isLinkActive(link)
                    return (
                      <motion.div
                        key={link.label}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                        className="w-full text-center"
                      >
                        {link.isMega ? (
                          <div className="w-full">
                            <button
                              onClick={() => setMobileExpandedLabel(isExpanded ? null : link.label)}
                              className="group inline-block w-full py-2 focus:outline-none bg-transparent border-none cursor-pointer"
                            >
                              <div className="flex items-center justify-center gap-4">
                                <span className="text-sm font-mono text-eco-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  0{i + 1}
                                </span>
                                <span className={`font-display text-4xl sm:text-5xl md:text-6xl tracking-wide transform-gpu will-change-transform transition-[transform,color] duration-300 ease-out flex items-center gap-2 ${
                                  isActive
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
                                  className="overflow-hidden bg-[#97B3D2]/[0.02] border border-white/5 rounded-2xl mt-2 w-full flex flex-col gap-6 py-4 px-5 text-left animate-slide-down"
                                >
                                  {link.megaMenu?.map((column) => (
                                    <div key={column.title} className="flex flex-col gap-2 w-full">
                                      <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-eco-muted border-b border-white/5 pb-1">
                                        {column.title}
                                      </h4>
                                      <div className="flex flex-col gap-3 pl-2 mt-1">
                                        {column.links.map((subLink) => {
                                          const isSubStatic = subLink.path.includes('/game-changer') || subLink.path.endsWith('.html');
                                          const isSubActive = location.pathname === subLink.path;
                                          const subLinkProps = {
                                            key: subLink.path,
                                            onClick: () => setIsOpen(false),
                                            className: `font-heading text-lg tracking-wide transition-colors duration-200 text-left block ${
                                              isSubActive
                                                ? 'text-[#97B3D2] font-semibold'
                                                : 'text-white/80 hover:text-white'
                                            }`
                                          };
                                          return (
                                            <div key={subLink.path} className="flex flex-col">
                                              {isSubStatic ? (
                                                <a href={subLink.path} {...subLinkProps}>
                                                  {subLink.label}
                                                </a>
                                              ) : (
                                                <Link to={subLink.path} {...subLinkProps}>
                                                  {subLink.label}
                                                </Link>
                                              )}
                                              {subLink.description && (
                                                <span className="text-xs text-eco-muted/70 mt-0.5 leading-normal">
                                                  {subLink.description}
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : link.dropdown ? (
                          <div className="w-full">
                            <button
                              onClick={() => setMobileExpandedLabel(isExpanded ? null : link.label)}
                              className="group inline-block w-full py-2 focus:outline-none bg-transparent border-none cursor-pointer"
                            >
                              <div className="flex items-center justify-center gap-4">
                                <span className="text-sm font-mono text-eco-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  0{i + 1}
                                </span>
                                <span className={`font-display text-4xl sm:text-5xl md:text-6xl tracking-wide transform-gpu will-change-transform transition-[transform,color] duration-300 ease-out flex items-center gap-2 ${
                                  isActive
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
                                  className="overflow-hidden bg-[#97B3D2]/[0.02] border border-white/5 rounded-2xl mt-2 w-full flex flex-col items-center gap-2 py-3 px-4"
                                >
                                  {link.dropdown.map((subItem) => {
                                    const isSubStatic = subItem.path.includes('/game-changer') || subItem.path.endsWith('.html');
                                    const isSubActive = location.pathname === subItem.path || (subItem.subItems && subItem.subItems.some(c => location.pathname === c.path));
                                    const subLinkProps = {
                                      key: subItem.path,
                                      onClick: () => {
                                        if (!subItem.subItems) setIsOpen(false);
                                      },
                                      className: `font-heading text-xl py-1.5 tracking-wider transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                                        isSubActive
                                          ? 'text-[#97B3D2] font-semibold'
                                          : 'text-white/80 hover:text-white'
                                      }`
                                    };
                                    return (
                                      <div key={subItem.path} className="w-full flex flex-col items-center gap-1">
                                        {isSubStatic ? (
                                          <a href={subItem.path} {...subLinkProps}>
                                            {subItem.label}
                                          </a>
                                        ) : (
                                          <Link to={subItem.path} {...subLinkProps}>
                                            {subItem.label}
                                          </Link>
                                        )}
                                        {subItem.subItems && (
                                          <div className="flex flex-col items-center gap-1 bg-white/[0.02] rounded-xl w-full py-1.5 my-1">
                                            {subItem.subItems.map((child) => {
                                              const isChildStatic = child.path.includes('/game-changer') || child.path.endsWith('.html');
                                              const childProps = {
                                                key: child.path,
                                                onClick: () => setIsOpen(false),
                                                className: `font-heading text-sm py-1 tracking-widest transition-colors duration-200 ${
                                                  location.pathname === child.path
                                                    ? 'text-[#97B3D2] font-medium'
                                                    : 'text-white/60 hover:text-white'
                                                }`
                                              };
                                              return isChildStatic ? (
                                                <a href={child.path} {...childProps}>{child.label}</a>
                                              ) : (
                                                <Link to={child.path} {...childProps}>{child.label}</Link>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (() => {
                          const isStatic = link.path.includes('/game-changer') || link.path.endsWith('.html');
                          const linkProps = {
                            onClick: () => setIsOpen(false),
                            className: "group inline-block w-full py-2"
                          };
                          const children = (
                            <div className="flex items-center justify-center gap-4">
                              <span className="text-sm font-mono text-eco-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                0{i + 1}
                              </span>
                              <span className={`font-display text-4xl sm:text-5xl md:text-6xl tracking-wide transform-gpu will-change-transform transition-[transform,color] duration-300 ease-out ${
                                isActive
                                  ? 'text-[#97B3D2] drop-shadow-[0_0_15px_rgba(151,179,210,0.4)]'
                                  : 'text-white hover:text-[#97B3D2] hover:scale-105'
                              }`}>
                                {link.label}
                              </span>
                            </div>
                          );
                          return isStatic ? (
                            <a href={link.path} {...linkProps}>{children}</a>
                          ) : (
                            <Link to={link.path} {...linkProps}>{children}</Link>
                          );
                        })()}
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
                    <Link 
                      to="/register" 
                      className="px-5 py-2.5 text-xs font-semibold rounded-full bg-[#97B3D2] text-[#060A10] hover:bg-[#B0C8E0] transition-colors" 
                      onClick={() => setIsOpen(false)}
                    >
                      Register for Tryouts
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
