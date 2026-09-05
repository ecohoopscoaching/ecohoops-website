import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface HeroProps {
  onRegisterClick?: () => void;
}

const BACKGROUND_IMAGES = [
  { src: '/images/IMG_0493.JPG', alt: 'EcoHoops team huddle' },
  { src: '/images/hero-bg-new-1.jpg', alt: 'EcoHoops U15 boys game play' },
  { src: '/images/hero-bg-new-13.jpg', alt: 'EcoHoops girls practice scrimmage' }
]

export default function Hero({ onRegisterClick }: HeroProps) {
  const [bgIndex, setBgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-44 sm:pt-44 md:pt-48 pb-16">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={bgIndex}
            src={BACKGROUND_IMAGES[bgIndex].src}
            alt={BACKGROUND_IMAGES[bgIndex].alt}
            decoding="async"
            loading={bgIndex === 0 ? "eager" : "lazy"}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-eco-black/85 via-eco-black/75 to-eco-black/90 z-10" />
        {/* Navy tint overlay */}
        <div className="absolute inset-0 bg-eco-navy/35 mix-blend-multiply z-10" />
        {/* Bottom fade to seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-eco-black to-transparent z-20" />
      </div>

      {/* Grid lines and floating elements need to sit above background slideshow but below text */}
      <div className="absolute inset-0 z-20 pointer-events-none">

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(151,179,210,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(151,179,210,0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Floating elements */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full border border-eco-blue/10 hidden lg:block"
        />
        <motion.div
          animate={{ y: [15, -15, 15], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/3 left-[10%] w-20 h-20 rounded-full border border-eco-navy-bright/15 hidden lg:block"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Single Clean Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 flex items-center justify-center"
        >
          <span className="tag">
            ECOHOOPS BASKETBALL • MISSISSAUGA, ON
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-hero uppercase mb-6 leading-none"
        >
          <span className="text-[clamp(1.2rem,3.2vw,2.8rem)] text-[#97B3D2] tracking-[0.25em] block mb-3 font-heading font-black">
            WE RAISE CEILINGS.
          </span>
          <span className="text-white">KIDS FIRST.</span>
          <br />
          <span className="gradient-text">ALWAYS.</span>
        </motion.h1>

        {/* Subtitle & Core Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto mb-10 space-y-4"
        >
          <p className="text-lg md:text-xl text-eco-muted-light font-body leading-relaxed">
            We don't care where your child ranks today. We care about where they can go. EcoHoops is built around game-like learning, player independence, and long-term human development.
          </p>
          <div className="inline-block px-4 py-2 rounded-xl bg-[#003366]/40 border border-[#97B3D2]/30 text-white text-xs md:text-sm font-heading font-semibold tracking-wide">
            "The child will never become less important than the result."
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="#jr-nba-waitlist"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('jr-nba-waitlist')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-glow flex items-center gap-2 text-base cursor-pointer"
          >
            Join the Waitlist
            <ArrowRight size={18} />
          </a>
          <a
            href="#programs"
            className="btn-ghost flex items-center gap-2 text-base cursor-pointer"
          >
            View Programs & Rep Teams
          </a>
        </motion.div>

        {/* Official Affiliations Trust Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-3xl mx-auto mb-10 px-4"
        >
          <div className="bg-[#050B14]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#97B3D2] font-semibold">
                  Official Affiliation & Sanctioned Programs
                </div>
                <div className="text-xs text-white/80 font-heading font-medium">
                  Canada Basketball • Jr. NBA • Jr. WNBA
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 sm:gap-6 flex-wrap justify-center">
              <img
                src="/images/branding/jr-nba-canada-basketball-dark-tight.png"
                alt="Jr. NBA • WNBA • Canada Basketball"
                className="h-8 sm:h-9 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
              />
              <div className="h-6 w-px bg-white/15 hidden sm:block" />
              <img
                src="/images/branding/canada-basketball-dark-horizontal-tight.png"
                alt="Canada Basketball"
                className="h-6 sm:h-7 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-4xl mx-auto mt-4"
        >
          <div className="bg-eco-surface/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:py-8 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 shadow-2xl relative overflow-hidden">
            {/* Subtle internal border dividing elements on desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#97B3D2]/5 to-transparent pointer-events-none" />
            
            {[
              { value: 'OBA Club', label: 'Ontario Basketball' },
              { value: 'Jr. NBA', label: 'Canada Basketball' },
              { value: 'Coalition', label: 'League Participant' },
              { value: 'Dual Entity', label: 'Inc. + Non-Profit Arm' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                className="text-center flex flex-col justify-center items-center"
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-white mb-2 leading-none">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-[#97B3D2] font-heading font-medium text-balance">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1 h-2 bg-eco-orange rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
