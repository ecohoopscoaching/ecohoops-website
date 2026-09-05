import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
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
import ProgramCards from '../components/home/ProgramCards'
import FeaturedReview from '../components/home/FeaturedReview'
import FAQ from '../components/home/FAQ'
import SafeSportBanner from '../components/home/SafeSportBanner'
import JrNbaAnnouncement from '../components/home/JrNbaAnnouncement'

export default function Home() {
  useDocumentTitle('Kids First. Always.')

  return (
    <>
      {/* 1. HERO & INTRO */}
      <Hero />

      {/* NEW FROM ECOHOOPS JR. - JR. NBA / JR. WNBA ANNOUNCEMENT & WAITLIST */}
      <JrNbaAnnouncement />
      <div className="section-divider" />

      <Marquee />

      {/* 1b. FIND YOUR FIT */}
      <FindYourFit />

      {/* 2. PROGRAM CARDS */}
      <ProgramCards />
      <div className="section-divider" />

      {/* 3. ONE PARENT REVIEW */}
      <FeaturedReview />
      <div className="section-divider" />

      {/* 4. WHY ECOHOOPS IS DIFFERENT */}
      <Features />
      <div className="section-divider" />

      {/* 5. HOW WE COACH */}
      <Pillars />
      <div className="section-divider" />

      {/* PHOTO GALLERY */}
      <PhotoGallery />
      
      {/* 6. PROGRAM SECTIONS */}
      <Nonprofit />
      <div className="section-divider" />
      <SafeSportBanner />
      <div className="section-divider" />
      <AllGirlsProgram />
      <JrProgram />
      <div className="section-divider" />
      <RepTeams />
      <div className="section-divider" />

      {/* 7. FOUNDER SECTION */}
      <CoachAdrian />
      <div className="section-divider" />

      {/* 8. VIDEO PROOF */}
      <Videos />
      <div className="section-divider" />

      {/* AUDIO & PODCASTS */}
      <Podcasts />
      <div className="section-divider" />

      {/* TESTIMONIALS SLIDER (LOWER) */}
      <Testimonials />
      <div className="section-divider" />

      {/* 9. INSTAGRAM & SOCIAL PROOF */}
      <InstagramFeed />

      {/* 10. FAQ */}
      <FAQ />

      {/* 11. FINAL CTA */}
      <CTA />

      {/* Floating Action Button (Jr. NBA / Jr. WNBA Waitlist) */}
      <motion.a
        href="#jr-nba-waitlist"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05, y: -2 }}
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('jr-nba-waitlist')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[40] flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full font-heading font-bold text-[10px] sm:text-xs uppercase tracking-wider text-white shadow-glow-md border border-eco-blue/30 transition-all duration-300 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #001c52, #1A4A8A)',
        }}
      >
        <Sparkles size={13} className="animate-pulse text-eco-blue" />
        <span>Join the Waitlist</span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#00D26A]" />
      </motion.a>
    </>
  )
}
