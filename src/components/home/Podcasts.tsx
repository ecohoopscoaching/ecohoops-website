import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Headphones, Sparkles } from 'lucide-react'

export default function Podcasts() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="py-24 bg-eco-navy/5 relative overflow-hidden">
      {/* Background visual element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-eco-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">EcoHoops Audio</span>
          <h2 className="font-display text-section uppercase tracking-tight mb-4 text-white">
            LISTEN & <span className="gradient-text">LEARN</span>
          </h2>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Headphones size={20} className="text-eco-blue" />
            Tune in to our latest podcast features and deep-dive discussions.
          </p>
        </motion.div>

        {/* Grid of embeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Episode 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glow-card p-4 bg-eco-surface/50 border border-eco-border backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-eco-blue">
              <Sparkles size={14} />
              Featured Episode 01
            </div>
            <iframe 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/episode/4c9ZysX4HbVC3p0O6LeZ2v?utm_source=generator&t=0" 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </motion.div>

          {/* Episode 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="glow-card p-4 bg-eco-surface/50 border border-eco-border backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-eco-blue">
              <Sparkles size={14} />
              Featured Episode 02
            </div>
            <iframe 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/episode/1aJVMPgLUTZgZrwAKeMDdj?utm_source=generator" 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
