import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { PILLARS } from '../data/content'
import { PHILOSOPHY_CONTENT } from '../data/content'
import { Zap, Puzzle, Flame, Brain, BookOpen, Heart, Target, Quote, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Puzzle, Flame, Brain,
}

export default function Philosophy() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal(0.05)
  const { ref: missionRef, isVisible: missionVisible } = useScrollReveal(0.1)
  const { ref: pillarsRef, isVisible: pillarsVisible } = useScrollReveal(0.1)
  const { ref: founderRef, isVisible: founderVisible } = useScrollReveal(0.1)
  const { ref: plgRef, isVisible: plgVisible } = useScrollReveal(0.1)

  return (
    <div className="pt-28 pb-20">
      {/* Hero with image */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="tag mb-4 inline-block">Our Approach</span>
            <h1 className="font-display text-hero uppercase mb-6">
              <span className="text-white">THE </span>
              <span className="gradient-text">ECOHOOPS</span>
              <br />
              <span className="text-white">PHILOSOPHY</span>
            </h1>
            <p className="text-xl text-eco-muted-light max-w-2xl leading-relaxed">
              We kept the grit, the community, and the love for the game — and burned the rest.
              This is basketball the way it was always meant to be.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden h-[350px] lg:h-[450px]"
          >
            <img
              src="/images/IMG_0283.JPG"
              alt="Coach directing players"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-eco-black/50 via-transparent to-eco-navy/20" />
            <div className="absolute inset-0 rounded-2xl border border-eco-blue/10" />
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section ref={missionRef} className="relative py-20 mb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-eco-surface/50 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={missionVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Quote size={48} className="text-eco-orange/20 mx-auto mb-8" fill="currentColor" />
            <p className="font-display text-3xl md:text-5xl uppercase text-white leading-tight mb-6">
              {PHILOSOPHY_CONTENT.mission}
            </p>
            <p className="text-eco-muted-light text-lg max-w-xl mx-auto">
              {PHILOSOPHY_CONTENT.vision}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Four Pillars Deep Dive */}
      <section ref={pillarsRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={pillarsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Science-Backed</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">THE FOUR </span>
            <span className="gradient-text">PILLARS</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar, i) => {
            const Icon = ICON_MAP[pillar.icon]
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={pillarsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="glow-card p-8 md:p-10"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${pillar.color}15`, border: `1px solid ${pillar.color}30` }}
                >
                  <Icon size={26} style={{ color: pillar.color }} />
                </div>
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-2"
                  style={{ color: pillar.color }}
                >
                  {pillar.subtitle}
                </p>
                <h3 className="font-display text-2xl uppercase text-white mb-4">
                  {pillar.title}
                </h3>
                <p className="text-eco-muted-light leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Play, Learn, Grow */}
      <section ref={plgRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={plgVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-section uppercase">
            <span className="gradient-text">PLAY. LEARN. GROW.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'PLAY',
              icon: Heart,
              color: '#6A9BC7',
              image: '/images/IMG_0379.JPG',
              description: 'Play is the foundation. It\'s how kids explore, experiment, and fall in love with the game. We create environments where play happens naturally — messy, loud, and alive.',
            },
            {
              title: 'LEARN',
              icon: Target,
              color: '#F0E6D3',
              image: '/images/IMG_0312.JPG',
              description: 'Learning happens through experience, not lectures. Through guided discovery and constraints, players develop basketball IQ, decision-making, and skills that transfer to real games.',
            },
            {
              title: 'GROW',
              icon: Zap,
              color: '#4A7FB5',
              image: '/images/IMG_0481.JPG',
              description: 'Growth goes beyond the court. Confidence, resilience, emotional regulation, teamwork — these are the real outcomes. We build people who happen to play basketball.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={plgVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className="glow-card overflow-hidden"
            >
              <div className="h-[180px] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-eco-surface via-eco-surface/50 to-transparent" />
              </div>
              <div className="p-8 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 -mt-12 relative z-10 backdrop-blur-sm"
                  style={{ backgroundColor: `${item.color}25`, border: `1px solid ${item.color}40` }}
                >
                  <item.icon size={24} style={{ color: item.color }} />
                </div>
                <h3
                  className="font-display text-4xl mb-4"
                  style={{ color: item.color }}
                >
                  {item.title}
                </h3>
                <p className="text-eco-muted-light leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section ref={founderRef} className="max-w-5xl mx-auto px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={founderVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glow-card p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden">
                <img
                  src="/images/IMG_0281.JPG"
                  alt="Founder"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div>
              <span className="tag mb-3 inline-block">The Founder</span>
              <h3 className="font-display text-3xl uppercase text-white mb-2">
                {PHILOSOPHY_CONTENT.founder.name}
              </h3>
              <p className="text-eco-orange font-heading font-semibold text-sm mb-4">
                {PHILOSOPHY_CONTENT.founder.title}
              </p>
              <p className="text-eco-muted-light leading-relaxed">
                {PHILOSOPHY_CONTENT.founder.bio}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Book Club */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 mb-24">
        <div className="glow-card p-8 md:p-10">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center flex-shrink-0">
              <BookOpen size={24} className="text-eco-blue-light" />
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-eco-blue-light mb-3">
                EcoHoops Book Club
              </h3>
              <p className="font-heading font-bold text-xl text-white mb-1">
                Recently Finished: <span className="text-eco-blue-light">{PHILOSOPHY_CONTENT.bookClub.current}</span>
              </p>
              <p className="text-sm text-eco-muted mb-1">by {PHILOSOPHY_CONTENT.bookClub.author}</p>
              <p className="text-sm text-eco-muted-light">{PHILOSOPHY_CONTENT.bookClub.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="font-display text-sub uppercase mb-4 text-white">
          Ready to see it in action?
        </h2>
        <p className="text-eco-muted-light mb-8">
          Come watch a session. Talk to the parents. See the difference for yourself.
        </p>
        <Link to="/register" className="btn-glow inline-flex items-center gap-2">
          Join EcoHoops <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
