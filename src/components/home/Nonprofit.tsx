import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Heart, Users, Dumbbell, Brain, ArrowRight } from 'lucide-react'

const INITIATIVES = [
  {
    title: 'Free Community Sessions',
    description: 'Weekly no-cost basketball sessions for underserved youth across the GTA. No registration fees, no barriers — just show up and play.',
    icon: Dumbbell,
  },
  {
    title: 'Girls in Sport',
    description: 'Dedicated, empowering all-girls basketball training to build confidence, skill, and peer leadership in a supportive and safe environment.',
    icon: Users,
  },
  {
    title: 'Mental Health Programs',
    description: 'Mindfulness workshops, emotional resilience training, and peer support circles — because the mind matters more than the score.',
    icon: Brain,
  },
  {
    title: 'Equipment & Access',
    description: 'Providing shoes, gear, and gym access to kids who need it. No child should be kept off the court because of cost.',
    icon: Heart,
  },
]

export default function Nonprofit() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Navy gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-eco-navy/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">EcoHoops for Kids Canada</span>
          <h2 className="font-display text-section uppercase mb-4">
            <span className="text-white">PLAY BUILDS </span>
            <span className="gradient-text">PEOPLE.</span>
          </h2>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto mb-6">
            Community impact. Access. Mental health. Opportunity.
          </p>
          <Link
            to="/nonprofit"
            className="btn-glow inline-flex items-center gap-2 !text-xs"
          >
            Learn More
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Photo Collage + Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Photo collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="rounded-2xl overflow-hidden h-[200px]">
              <img src="/images/11.png" alt="Girls team photo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-2xl overflow-hidden h-[200px]">
              <img src="/images/4.png" alt="Girls practicing" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-2xl overflow-hidden h-[200px] col-span-2">
              <img src="/images/13.png" alt="Girls team with coaches" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>

          {/* Initiatives */}
          <div className="grid grid-cols-1 gap-4">
            {INITIATIVES.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="glow-card p-6 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-eco-navy-bright/30 border border-eco-blue/20 flex items-center justify-center flex-shrink-0 group-hover:bg-eco-navy-bright/50 group-hover:border-eco-blue/40 transition-all duration-300">
                    <item.icon size={18} className="text-eco-blue" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-eco-muted-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact Stats + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glow-card p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Stats */}
            <div className="flex-1 grid grid-cols-3 gap-6 text-center">
              {[
                { value: 'Federal', label: 'Registered Status' },
                { value: '100%', label: 'Direct Impact' },
                { value: 'Subsidized', label: 'Aid If Needed' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl md:text-3xl gradient-text mb-1 uppercase">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-eco-muted font-heading">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-24 bg-eco-border" />

            {/* CTA */}
            <div className="text-center md:text-left">
              <p className="font-heading font-bold text-white text-lg mb-2">
                Support the mission
              </p>
              <p className="text-sm text-eco-muted-light mb-4">
                Every dollar goes directly to putting kids on the court.
              </p>
              <Link
                to="/register"
                className="btn-glow inline-flex items-center gap-2 !text-xs"
              >
                Get Involved
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
