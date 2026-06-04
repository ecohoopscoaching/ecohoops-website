import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { PILLARS } from '../../data/content'
import { Zap, Puzzle, Flame, Brain } from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Puzzle, Flame, Brain,
}

const PILLAR_IMAGES = [
  '/images/IMG_0349.JPG',
  '/images/2.png',
  '/images/IMG_0286.JPG',
  '/images/IMG_0340.JPG',
]

export default function Pillars() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
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
          <span className="tag mb-4 inline-block">Our Foundation</span>
          <h2 className="font-display text-section uppercase mb-4">
            <span className="text-white">FOUR PILLARS.</span>
            <br />
            <span className="gradient-text">ONE MISSION.</span>
          </h2>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto">
            Research-backed. Kid-tested. Built on the science of how humans actually learn, grow, and thrive.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="space-y-8">
          {PILLARS.map((pillar, i) => {
            const Icon = ICON_MAP[pillar.icon]
            const isEven = i % 2 === 0

            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 * i }}
                className="glow-card p-8 md:p-12"
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
                    <h3 className="font-display text-3xl md:text-4xl uppercase text-white mb-4">
                      {pillar.title}
                    </h3>
                    <p className="text-eco-muted-light leading-relaxed max-w-2xl">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
