import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/IMG_0493.JPG"
          alt="EcoHoops team huddle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-eco-black/80 via-eco-black/70 to-eco-black/90" />
        {/* Navy tint overlay */}
        <div className="absolute inset-0 bg-eco-navy/30 mix-blend-multiply" />
        {/* Bottom fade to seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-eco-black to-transparent" />

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
          <span className="tag">The Anti-Elite Basketball Movement</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-hero uppercase mb-6 leading-none"
        >
          <span className="text-white">KIDS FIRST.</span>
          <br />
          <span className="gradient-text">ALWAYS.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-eco-muted-light max-w-2xl mx-auto mb-10 font-body leading-relaxed"
        >
          Basketball built for kids, not adult egos.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/register" className="btn-glow flex items-center gap-2 text-base">
            Find a Program
            <ArrowRight size={18} />
          </Link>
          <Link to="/nonprofit" className="btn-ghost flex items-center gap-2 text-base">
            Support the Nonprofit
          </Link>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '2', label: 'Years Strong' },
            { value: 'Non-Profit', label: 'Registered Status' },
            { value: '100%', label: 'Backed by Sports Science' },
            { value: 'Inclusive', label: 'Non-Discriminatory' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-3xl md:text-4xl gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-eco-muted font-heading">
                {stat.label}
              </div>
            </motion.div>
          ))}
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
