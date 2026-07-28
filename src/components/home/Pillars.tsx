import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { PILLARS } from '../../data/content'
import { Zap, Puzzle, Flame, Brain, Shuffle, TrendingUp, ArrowRight } from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Puzzle, Flame, Brain, Shuffle, TrendingUp,
}

const PILLAR_IMAGES = [
  '/images/IMG_0349.JPG',
  '/images/2.png',
  '/images/IMG_0286.JPG',
  '/images/IMG_0340.JPG',
  '/images/IMG_0350.JPG',
  '/images/IMG_0373.JPG',
]

export default function Pillars() {
  const { ref, isVisible } = useScrollReveal(0.1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Subtle background team image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/hero-bg-new-13.jpg" 
          alt="EcoHoops scrimmage session" 
          className="w-full h-full object-cover opacity-[0.03] mix-blend-luminosity filter contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-eco-black via-transparent to-eco-black" />
      </div>

      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-eco-surface/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="tag mb-4 inline-block">Our Coaching Method</span>
          <h2 className="font-display text-section uppercase mb-4">
            <span className="text-white">HOW WE </span>
            <span className="gradient-text">COACH</span>
          </h2>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto">
            A kids-first basketball movement focused on development, joy, and belonging. Click on any pillar to explore the science.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="space-y-8">
          {PILLARS.map((pillar, i) => {
            const Icon = ICON_MAP[pillar.icon]
            const isEven = i % 2 === 0

            return (
              <Link
                key={pillar.title}
                to={`/pillar/${pillar.slug}`}
                className="block cursor-pointer focus:outline-none"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  whileHover={{ scale: 1.015, y: -2 }}
                  transition={{ 
                    x: { duration: 0.7, delay: 0.15 * i },
                    opacity: { duration: 0.7, delay: 0.15 * i },
                    scale: { duration: 0.2 },
                    y: { duration: 0.2 }
                  }}
                  className="glow-card p-8 md:p-12 transition-all duration-300"
                  style={{ 
                    borderColor: hoveredIndex === i ? `${pillar.color}50` : undefined,
                    boxShadow: hoveredIndex === i ? `0 10px 30px -10px ${pillar.color}20` : undefined
                  }}
                >
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch gap-8`}>
                    {/* Image */}
                    <div className="flex-shrink-0 w-full md:w-[280px] h-[200px] md:h-auto rounded-xl overflow-hidden relative">
                      <img
                        src={PILLAR_IMAGES[i]}
                        alt={pillar.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-eco-black/50 via-transparent to-eco-navy/20" />
                      <div
                        className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm"
                        style={{ backgroundColor: `${pillar.color}25`, border: `1px solid ${pillar.color}40` }}
                      >
                        <Icon size={22} style={{ color: pillar.color }} />
                      </div>
                      <span
                        className="absolute bottom-4 right-4 font-display text-6xl leading-none opacity-20"
                        style={{ color: pillar.color }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div
                        className="text-xs font-mono uppercase tracking-widest mb-2"
                        style={{ color: pillar.color }}
                      >
                        {pillar.subtitle}
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl uppercase text-white mb-4 transition-colors group-hover:text-eco-blue">
                        {pillar.title}
                      </h3>
                      <p className="text-eco-muted-light leading-relaxed max-w-2xl">
                        {pillar.description}
                      </p>
                      <span 
                        className="text-xs font-mono uppercase mt-4 inline-flex items-center gap-1 transition-colors"
                        style={{ color: hoveredIndex === i ? '#ffffff' : pillar.color }}
                      >
                        See How We Coach <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* The Game Changer Ebook & Library Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 bg-gradient-to-r from-eco-surface to-eco-navy/40 border border-eco-blue/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-glow-sm"
        >
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-eco-blue/5 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="flex-1">
            <span className="bg-eco-blue/10 border border-eco-blue/20 text-eco-blue text-[10px] uppercase font-mono px-2.5 py-1 rounded-full inline-block mb-4 font-bold tracking-wider">
              📖 The Game Changer Ebook
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-white uppercase mb-3">
              Explore Our Complete Science Guide
            </h3>
            <p className="text-eco-muted-light max-w-xl text-sm leading-relaxed">
              Read our interactive 16-chapter ebook on Ecological Dynamics and the Constraints-Led Approach in basketball. Access our database of 122 game-like constraints to learn how kids acquire skills naturally.
            </p>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <a
              href="/game-changer/index.html"
              className="btn-glow !px-8 !py-4 text-center font-bold text-eco-black text-sm uppercase tracking-wider rounded-xl block md:inline-block w-full sm:w-auto"
            >
              Start Reading
            </a>
            <a
              href="/game-changer/library.html"
              className="text-white hover:text-eco-blue border border-white/10 hover:border-eco-blue/30 bg-white/5 hover:bg-eco-blue/5 transition-all duration-300 font-heading text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Constraints Library <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
