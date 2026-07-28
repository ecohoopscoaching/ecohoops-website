import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Smile, Award, Star } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const CARDS = [
  {
    category: 'Recreational & Development',
    title: 'Youth Programs',
    description: 'Perfect for kids learning the game, building confidence, or looking for subsidized community sessions. High-energy, low-pressure training.',
    tags: ['Ages 5–11', 'Beginner Friendly', 'Subsidized'],
    buttonText: 'Explore Youth & Jr. Programs',
    path: '/jr',
    color: 'from-[#4A7FB5]/20 to-[#6A9BC7]/10',
    borderColor: 'group-hover:border-[#6A9BC7]/40',
    icon: Smile,
  },
  {
    category: 'Competitive Division',
    title: 'Rep Teams',
    description: 'For experienced players ready for structured games, skill-based divisions, and team play. Professional coaching focusing on long-term growth.',
    tags: ['Ages 11–16', 'Mississauga League', 'Skills Focused'],
    buttonText: 'View Rep Division',
    path: '/rep',
    color: 'from-[#97B3D2]/25 to-[#4A7FB5]/10',
    borderColor: 'group-hover:border-[#97B3D2]/50',
    icon: Award,
  },
  {
    category: 'Dedicated Spaces',
    title: 'All Girls Programs',
    description: 'Empowering all-girls training environments led by positive mentors. Focused on building self-esteem, peer relationships, and core skills.',
    tags: ['All Skill Levels', 'Female Coaching', 'Community Focus'],
    buttonText: 'Explore Girls Programs',
    path: '/girls',
    color: 'from-[#B0C8E0]/20 to-[#97B3D2]/10',
    borderColor: 'group-hover:border-[#B0C8E0]/40',
    icon: Star,
  }
]

export default function FindYourFit() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="relative py-24 bg-eco-black overflow-hidden border-b border-white/5">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-radial from-eco-blue/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="tag mb-4 inline-block">Unsure where to start?</span>
          <h2 className="font-display text-section uppercase mb-4">
            <span className="text-white">FIND YOUR </span>
            <span className="gradient-text">FIT</span>
          </h2>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you are picking up a basketball for the first time or ready to compete in rep divisions, we have a place for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-eco-surface/50 border border-white/5 hover:bg-eco-surface/80 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
              >
                {/* Background glow block */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

                <div>
                  {/* Category & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono uppercase tracking-wider text-eco-blue-light bg-[#97B3D2]/10 px-3 py-1 rounded-full">
                      {card.category}
                    </span>
                    <Icon className="text-eco-blue w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-2xl font-bold text-white mb-4">
                    {card.title}
                  </h3>
                  <p className="text-sm text-eco-muted-light leading-relaxed mb-6">
                    {card.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {card.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-white/50 border border-white/10 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Link Button */}
                <Link
                  to={card.path}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 group-hover:bg-[#97B3D2] text-white group-hover:text-[#060A10] font-heading font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border border-white/5 group-hover:border-[#97B3D2]"
                >
                  {card.buttonText}
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
