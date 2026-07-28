import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useScrollReveal, useMouseGlow } from '../../hooks/useScrollReveal'

export default function FeaturedReview() {
  const { ref, isVisible } = useScrollReveal(0.05)
  const glowRef = useMouseGlow()

  return (
    <section ref={ref} className="relative py-16 overflow-hidden bg-eco-black">
      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={glowRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="glow-card p-8 md:p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #090e1a, #0d1627)',
          }}
        >
          <Quote
            size={40}
            className="text-eco-blue/10 mx-auto mb-6"
            fill="currentColor"
          />

          {/* 5-Star Google Rating */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-eco-blue fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>

          <p className="text-lg md:text-2xl font-heading font-medium text-white leading-relaxed mb-6 text-balance">
            "We couldn't be happier with our experience at Ecohoops. It's an incredibly positive and encouraging environment where young players truly love being on the court. Practices are creative and game-based, not old-school drills, which helps players learn organically through playing. Players are encouraged to share their opinions, reflect on their performances, and grow with confidence. Ecohoops isn't just about basketball- it's about developing thoughtful, well-rounded human beings, teammates, and friends through meaningful social activities off the court. Fantastic club! Strongly recommend!"
          </p>

          <div className="flex flex-col items-center justify-center gap-1">
            <p className="font-heading font-bold text-white flex items-center gap-2">
              Katarina Homolova
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-eco-blue/10 text-eco-blue border border-eco-blue/20 uppercase tracking-wider">
                Google Review
              </span>
            </p>
            <p className="text-xs text-eco-muted">
              Parent &middot; U15 Mississauga Basketball Training
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
