import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { TESTIMONIALS } from '../../data/content'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Testimonials() {
  const { ref, isVisible } = useScrollReveal(0.1)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/8.png"
          alt="Basketball court"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-eco-black/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-eco-black via-transparent to-eco-black" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="tag mb-4 inline-block">What Parents Say</span>
          <h2 className="font-display text-section uppercase mb-16">
            <span className="gradient-text">REAL TALK</span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative">
          <div className="glow-card p-10 md:p-16 text-center min-h-[300px] flex flex-col items-center justify-center">
            {/* Quote icon */}
            <Quote
              size={48}
              className="text-eco-blue/20 mb-8"
              fill="currentColor"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* 5-Star Rating for Google Reviews */}
                {TESTIMONIALS[current].role.includes('Google') && (
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
                )}

                <p className="text-xl md:text-2xl lg:text-3xl font-heading font-medium text-white leading-relaxed mb-8 text-balance">
                  "{TESTIMONIALS[current].quote}"
                </p>
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="font-heading font-bold text-white flex items-center gap-2">
                    {TESTIMONIALS[current].name}
                    {TESTIMONIALS[current].role.includes('Google') && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-eco-blue/10 text-eco-blue border border-eco-blue/20 uppercase tracking-wider">
                        Google
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-eco-muted">
                    {TESTIMONIALS[current].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-eco-border flex items-center justify-center text-eco-muted hover:text-white hover:border-eco-blue/30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 bg-eco-blue'
                      : 'w-1.5 bg-eco-muted/30 hover:bg-eco-muted/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-eco-border flex items-center justify-center text-eco-muted hover:text-white hover:border-eco-blue/30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
