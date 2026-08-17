import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Calendar } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Hero from '../components/home/Hero'
import Marquee from '../components/home/Marquee'
import FindYourFit from '../components/home/FindYourFit'
import PhotoGallery from '../components/home/PhotoGallery'
import Nonprofit from '../components/home/Nonprofit'
import AllGirlsProgram from '../components/home/AllGirlsProgram'
import JrProgram from '../components/home/JrProgram'
import RepTeams from '../components/home/RepTeams'
import Pillars from '../components/home/Pillars'
import Features from '../components/home/Features'
import Videos from '../components/home/Videos'
import Podcasts from '../components/home/Podcasts'
import CoachAdrian from '../components/home/CoachAdrian'
import Testimonials from '../components/home/Testimonials'
import InstagramFeed from '../components/home/InstagramFeed'
import CTA from '../components/home/CTA'
import TryoutsBanner from '../components/home/TryoutsBanner'
import ProgramCards from '../components/home/ProgramCards'
import FeaturedReview from '../components/home/FeaturedReview'
import FAQ from '../components/home/FAQ'
import SafeSportBanner from '../components/home/SafeSportBanner'
import JrNbaAnnouncement from '../components/home/JrNbaAnnouncement'

export default function Home() {
  useDocumentTitle('Kids First. Always.')
  const [showModal, setShowModal] = useState(false)
  const [iframeLoading, setIframeLoading] = useState(true)
  const [mountIframe, setMountIframe] = useState(false)

  // Defer iframe rendering until modal opens to yield low INP (Interaction to Next Paint)
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setMountIframe(true)
      }, 350)
      return () => clearTimeout(timer)
    } else {
      // Defer unmounting the heavy iframe to a later tick (after transition finishes)
      // to keep the close click interaction extremely fast (INP < 16ms)
      const timer = setTimeout(() => {
        setMountIframe(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [showModal])

  // Popup is active until end of August 2, 2026 (Eastern time)
  const TRYOUT_DEADLINE = new Date('2026-08-03T04:00:00Z') // Aug 2 11:59 PM ET = Aug 3 04:00 UTC
  const tryoutsActive = new Date() < TRYOUT_DEADLINE

  const handleCloseModal = () => {
    setShowModal(false)
    // Only save dismissal during the active window so the key doesn't linger forever
    if (tryoutsActive) {
      sessionStorage.setItem('dismissedTryoutsPopup', 'true')
    }
  }

  // Auto-open modal on page load after a short delay
  useEffect(() => {
    const hasUrlTrigger = window.location.hash === '#tryouts' || window.location.search.includes('tryouts=true')

    if (!tryoutsActive) {
      // Tryout window has passed — never auto-open
      return
    }

    if (hasUrlTrigger) {
      setShowModal(true)
      setIframeLoading(true)
    } else {
      // Show on every new session (sessionStorage resets when the tab/browser closes)
      const hasDismissedThisSession = sessionStorage.getItem('dismissedTryoutsPopup')
      if (!hasDismissedThisSession) {
        const timer = setTimeout(() => {
          setShowModal(true)
          setIframeLoading(true)
        }, 3000) // 3s delay
        return () => clearTimeout(timer)
      }
    }

    const handleUrlTrigger = () => {
      if (window.location.hash === '#tryouts' || window.location.search.includes('tryouts=true')) {
        setShowModal(true)
        setIframeLoading(true)
      }
    }
    window.addEventListener('hashchange', handleUrlTrigger)
    return () => window.removeEventListener('hashchange', handleUrlTrigger)
  }, [])

  // Safety timeout: If iframe doesn't finish loading in 3.5s, clear the loading state so user isn't stuck forever.
  useEffect(() => {
    if (showModal && iframeLoading) {
      const timer = setTimeout(() => {
        setIframeLoading(false)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [showModal, iframeLoading])

  // Lock scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  return (
    <>
      {/* 1. HERO & INTRO */}
      <Hero onRegisterClick={() => setShowModal(true)} />

      {/* NEW FROM ECOHOOPS JR. - JR. NBA / JR. WNBA ANNOUNCEMENT & WAITLIST */}
      <JrNbaAnnouncement />
      <div className="section-divider" />

      <Marquee />

      {/* 1b. FIND YOUR FIT */}
      <FindYourFit />

      {/* 2. TRYOUTS BANNER */}
      <TryoutsBanner onRegisterClick={() => setShowModal(true)} />
      <div className="section-divider" />

      {/* 3. PROGRAM CARDS */}
      <ProgramCards />
      <div className="section-divider" />

      {/* 4. ONE PARENT REVIEW */}
      <FeaturedReview />
      <div className="section-divider" />

      {/* 5. WHY ECOHOOPS IS DIFFERENT */}
      <Features />
      <div className="section-divider" />

      {/* 6. HOW WE COACH */}
      <Pillars />
      <div className="section-divider" />

      {/* PHOTO GALLERY */}
      <PhotoGallery />
      {/* 7. PROGRAM SECTIONS */}
      <Nonprofit />
      <div className="section-divider" />
      <SafeSportBanner />
      <div className="section-divider" />
      <AllGirlsProgram />
      <JrProgram />
      <div className="section-divider" />
      <RepTeams />
      <div className="section-divider" />

      {/* 8. FOUNDER SECTION */}
      <CoachAdrian />
      <div className="section-divider" />

      {/* 9. VIDEO PROOF */}
      <Videos />
      <div className="section-divider" />

      {/* AUDIO & PODCASTS */}
      <Podcasts />
      <div className="section-divider" />

      {/* TESTIMONIALS SLIDER (LOWER) */}
      <Testimonials />
      <div className="section-divider" />

      {/* 10. INSTAGRAM & SOCIAL PROOF */}
      <InstagramFeed />

      {/* 11. FAQ */}
      <FAQ />

      {/* 12. FINAL CTA */}
      <CTA />

      {/* Floating Action Button (Tryout Registration) */}
      <AnimatePresence>
        {!showModal && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            whileHover={{ scale: 1.05, y: -2 }}
            onClick={() => {
              setShowModal(true)
              setIframeLoading(true)
            }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[40] flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full font-heading font-bold text-[10px] sm:text-xs uppercase tracking-wider text-white shadow-glow-md border border-eco-blue/30 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #001c52, #1A4A8A)',
            }}
          >
            <Calendar size={12} className="animate-pulse text-eco-blue" />
            <span>Rep Tryouts Registration</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#00D26A]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Rep Tryout Registration Modal Popup */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-eco-black/80 backdrop-blur-md"
          >
            {/* Modal Card container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-4xl h-[85vh] bg-eco-surface border border-eco-border rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-eco-surface2 border-b border-eco-border flex justify-between items-center flex-shrink-0">
                <div>
                  <h3 className="font-heading font-bold text-white text-base md:text-lg flex items-center gap-2">
                    <Calendar className="text-eco-blue" size={18} />
                    EcoHoops Rep Team Application
                  </h3>
                  <p className="text-[11px] text-eco-muted font-heading uppercase tracking-wider mt-0.5">
                    Mississauga & GTA Competitive League Squads
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/5 rounded-full text-eco-muted hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Iframe Body */}
              <div className="flex-1 relative bg-white overflow-hidden">
                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-eco-dark/95 z-20 p-6 text-center">
                    <Loader2 className="animate-spin text-eco-blue mb-3" size={32} />
                    <span className="font-heading text-xs uppercase tracking-widest text-eco-muted">Loading Application Form...</span>
                    <p className="text-xs text-eco-muted mt-6 max-w-sm">
                      Taking too long? You can also{' '}
                      <a 
                        href="https://docs.google.com/forms/d/e/1FAIpQLSe5VRmXBfBeQ0qy_Vw6ZQviioSxlC1C1UgbXVXeq15GbaxI6g/viewform" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-eco-blue hover:underline font-bold"
                      >
                        open the Google Form directly
                      </a>
                      .
                    </p>
                  </div>
                )}
                
                {mountIframe && (
                  <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSe5VRmXBfBeQ0qy_Vw6ZQviioSxlC1C1UgbXVXeq15GbaxI6g/viewform?embedded=true"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    onLoad={() => setIframeLoading(false)}
                    title="Rep Tryout Registration Form"
                    className="w-full h-full"
                  >
                    Loading Application…
                  </iframe>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
