import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Heart, ShieldCheck, Sparkles, Award, ArrowRight } from 'lucide-react'

export default function AllGirlsProgram() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-eco-dark">
      {/* Background radial accent glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-eco-orange/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-eco-blue/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Polaroid Collage with 2012 Squad */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -3 }}
            animate={isVisible ? { opacity: 1, x: 0, rotate: -1 } : {}}
            transition={{ duration: 0.8, type: 'spring' }}
            className="lg:col-span-5 relative bg-white p-4 pb-14 shadow-2xl max-w-md mx-auto w-full group hover:rotate-1 hover:scale-105 transition-all duration-300"
          >
            {/* Tape Effect */}
            <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-28 h-7 bg-white/70 backdrop-blur-md -rotate-2 z-10 shadow-sm" />
            
            {/* Image Box */}
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative border border-gray-200">
              <img
                src="/images/12.png"
                alt="EcoHoops 2012 Girls Rep Squad"
                className="w-full h-full object-cover filter contrast-110 saturate-[0.85] group-hover:saturate-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Label */}
            <div className="absolute bottom-4 left-0 w-full text-center">
              <span className="font-graffiti text-eco-black text-2xl tracking-wider block">
                2012 Girls Rep Squad
              </span>
              <span className="text-[10px] text-gray-400 font-heading uppercase tracking-widest mt-0.5 block">
                Mississauga League Competitors
              </span>
            </div>
          </motion.div>

          {/* Right Side: Program Copy and Details */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="tag mb-4 inline-block">All Girls</span>
              <h2 className="font-display text-section uppercase tracking-tight mb-6">
                <span className="text-white">BUILT FOR </span>
                <span className="gradient-text">GIRLS.</span>
              </h2>
              <p className="text-eco-muted-light text-lg leading-relaxed">
                Designed to help them thrive.
              </p>
            </motion.div>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Psychological Safety',
                  desc: 'No anxiety, no pressure. A growth-focused environment where making structural learning mistakes is welcomed as part of skill discovery.',
                  icon: Sparkles,
                  color: 'from-eco-orange to-eco-orange-light'
                },
                {
                  title: 'Mentorship & Ratios',
                  desc: 'Individualized coaching with high-quality player-to-coach ratios (8:1) led by dedicated mentors who advocate for girls in sports.',
                  icon: Award,
                  color: 'from-eco-blue to-eco-blue-light'
                },
                {
                  title: 'Socioeconomic Subsidies',
                  desc: 'Grounded in our non-profit mission, we offer extensive subsidies and full sponsorships to ensure cost is never a barrier.',
                  icon: Heart,
                  color: 'from-eco-orange to-eco-blue'
                },
                {
                  title: 'Logistical Equality',
                  desc: 'Equal priority court times, equal facility access, and prime tournament funding—representing true equity in competitive sports.',
                  icon: ShieldCheck,
                  color: 'from-eco-blue-light to-white'
                }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  className="bg-eco-surface2 p-6 rounded-2xl border border-eco-border hover:border-eco-orange/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-eco-navy flex items-center justify-center text-eco-orange">
                      <item.icon size={16} />
                    </div>
                    <h3 className="font-heading font-bold text-white text-sm">{item.title}</h3>
                  </div>
                  <p className="text-xs text-eco-muted-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Action Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <Link to="/girls" className="w-full sm:w-auto btn-glow flex items-center justify-center gap-2">
                Explore Girls Programs
                <ArrowRight size={16} />
              </Link>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}
