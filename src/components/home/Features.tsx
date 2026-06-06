import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal, useMouseGlow } from '../../hooks/useScrollReveal'
import { FEATURES } from '../../data/content'
import {
  Users, Calendar, CheckCircle, MessageCircle, CreditCard, Bot, Zap, Brain, Trophy
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  Users, Calendar, CheckCircle, MessageCircle, CreditCard, Bot, Zap, Brain, Trophy
}

export default function Features() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-eco-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="tag mb-4 inline-block">The Difference</span>
          <h2 className="font-display text-section uppercase mb-4">
            <span className="text-white">WHY ECOHOOPS </span>
            <span className="gradient-text">IS DIFFERENT</span>
          </h2>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto">
            A kids-first basketball movement focused on development, joy, and belonging.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon]
            return (
              <FeatureCard
                key={feature.title}
                feature={feature}
                Icon={Icon}
                index={i}
                isVisible={isVisible}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  Icon,
  index,
  isVisible,
}: {
  feature: typeof FEATURES[number]
  Icon: React.ElementType
  index: number
  isVisible: boolean
}) {
  const glowRef = useMouseGlow()

  return (
    <motion.div
      ref={glowRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className="glow-card group cursor-pointer transition-transform duration-300 hover:-translate-y-1 block h-full overflow-hidden"
    >
      <Link to={(feature as any).link || '/'} className="p-8 block h-full w-full">
        <div className="w-12 h-12 rounded-xl bg-eco-orange/10 border border-eco-orange/20 flex items-center justify-center mb-5 group-hover:bg-eco-orange/20 group-hover:border-eco-orange/40 transition-all duration-300">
          <Icon size={22} className="text-eco-orange" />
        </div>
        <h3 className="font-heading font-bold text-lg text-white mb-3 flex items-center gap-3">
          <span>{feature.title}</span>
          <span className="opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-eco-orange">→</span>
        </h3>
        <p className="text-sm text-eco-muted-light leading-relaxed">
          {feature.description}
        </p>
      </Link>
    </motion.div>
  )
}
