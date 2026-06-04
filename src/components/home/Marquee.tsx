import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const WORDS = [
  'PLAY', 'LEARN', 'GROW', 'HUSTLE', 'CREATE', 'COMPETE',
  'BELIEVE', 'ADAPT', 'THRIVE', 'UNITE', 'BUILD', 'INSPIRE',
]

export default function Marquee() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="relative py-8 overflow-hidden border-y border-eco-border">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="flex animate-marquee"
      >
        {[...WORDS, ...WORDS].map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex-shrink-0 mx-8 font-display text-5xl md:text-7xl uppercase text-white/[0.04] hover:text-eco-orange/20 transition-colors duration-500 cursor-default select-none"
          >
            {word}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
