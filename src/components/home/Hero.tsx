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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={bgIndex}
            src={BACKGROUND_IMAGES[bgIndex].src}
            alt={BACKGROUND_IMAGES[bgIndex].alt}
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
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <span className="tag">ECOHOOPS BASKETBALL MISSISSAUGA</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-hero uppercase mb-6 leading-none"
        >
          <span className="text-[clamp(1.2rem,3vw,2.5rem)] text-eco-blue tracking-[0.2em] block mb-4 font-heading font-extrabold">
            ECOHOOPS MISSISSAUGA
          </span>
          <span className="text-white">KIDS FIRST.</span>
          <br />
          <span className="gradient-text">ALWAYS.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-eco-muted-light max-w-3xl mx-auto mb-10 font-body leading-relaxed"
        >
          We help players become smarter, more confident competitors by teaching basketball the way it's actually played — so improvement transfers directly to real games.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onRegisterClick}
            className="btn-glow flex items-center gap-2 text-base cursor-pointer"
          >
            Register for Tryouts
            <ArrowRight size={18} />
          </button>
          <a
            href="#programs"
            className="btn-ghost flex items-center gap-2 text-base cursor-pointer"
          >
            View Programs
          </a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <div className="bg-eco-surface/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:py-8 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 shadow-2xl relative overflow-hidden">
            {/* Subtle internal border dividing elements on desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#97B3D2]/5 to-transparent pointer-events-none" />
            
            {[
              { value: '2', label: 'Years Strong' },
              { value: 'Nonprofit', label: 'Arm' },
              { value: 'Science', label: 'Built With Sports Science' },
              { value: 'Belonging', label: 'Every Kid Belongs' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                className="text-center flex flex-col justify-center items-center"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-white mb-2 leading-none">
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
