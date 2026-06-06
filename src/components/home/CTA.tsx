import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background Image */}
          <img
            src="/images/IMG_0373.JPG"
            alt="Game action"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-eco-black/75" />
          <div className="absolute inset-0 bg-gradient-to-br from-eco-navy/60 via-eco-black/50 to-eco-black/70" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Glow orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-eco-blue/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-eco-navy-bright/20 rounded-full blur-[80px]" />

          <div className="relative z-10 px-8 py-20 md:px-16 md:py-28 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-display text-section uppercase mb-6">
                READY TO{' '}
                <span className="gradient-text">GET STARTED</span>
                ?
              </h2>
              <p className="text-lg text-eco-muted-light max-w-xl mx-auto mb-10">
                Join the EcoHoops family today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-glow flex items-center gap-2 text-base">
                  Find a Program
                  <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn-ghost">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Border glow */}
          <div className="absolute inset-0 rounded-3xl border border-eco-orange/10" />
        </motion.div>
      </div>
    </section>
  )
}
