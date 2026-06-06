import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { PILLARS } from '../data/content'
import { PHILOSOPHY_CONTENT } from '../data/content'
import { Zap, Puzzle, Flame, Brain, BookOpen, Heart, Target, Quote, ArrowRight, Shuffle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Puzzle, Flame, Brain, Shuffle, TrendingUp,
}

export default function Philosophy() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal(0.05)
  const { ref: missionRef, isVisible: missionVisible } = useScrollReveal(0.1)
  const { ref: pillarsRef, isVisible: pillarsVisible } = useScrollReveal(0.1)
  const { ref: founderRef, isVisible: founderVisible } = useScrollReveal(0.1)
  const { ref: plgRef, isVisible: plgVisible } = useScrollReveal(0.1)
  const { ref: translationRef, isVisible: translationVisible } = useScrollReveal(0.1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="pt-28 pb-20">
      {/* Hero with image */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 relative z-10"
          >
            <span className="tag mb-4 inline-block">Our Approach</span>
            <h1 className="font-display text-hero uppercase mb-6 leading-[0.9] tracking-[0.04em]">
              <span className="text-white">THE </span>
              <span className="gradient-text">ECOHOOPS</span>
              <br />
              <span className="text-white">PHILOSOPHY</span>
            </h1>
            <p className="text-xl text-eco-muted-light max-w-2xl leading-relaxed">
              We kept the hard work, the friendly team, and the love for the game. We threw away all the toxic pressure. This is basketball played the right way.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative rounded-2xl overflow-hidden h-[350px] lg:h-[450px] z-0"
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

      {/* Six Pillars Deep Dive */}
      <section ref={pillarsRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={pillarsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Science-Backed</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">THE SIX </span>
            <span className="gradient-text">PILLARS</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar, i) => {
            const Icon = ICON_MAP[pillar.icon]
            return (
              <Link
                key={pillar.title}
                to={`/pillar/${pillar.slug}`}
                className="block cursor-pointer focus:outline-none"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={pillarsVisible ? { opacity: 1, y: 0 } : {}}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ 
                    y: { duration: 0.2 },
                    scale: { duration: 0.2 }
                  }}
                  className="glow-card p-8 md:p-10 h-full flex flex-col justify-between transition-all duration-300"
                  style={{ 
                    borderColor: hoveredIndex === i ? `${pillar.color}50` : undefined,
                    boxShadow: hoveredIndex === i ? `0 10px 30px -10px ${pillar.color}20` : undefined
                  }}
                >
                  <div>
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
                    <h3 className="font-heading font-bold text-xl uppercase text-white mb-4">
                      {pillar.title}
                    </h3>
                    <p className="text-eco-muted-light leading-relaxed mb-6">
                      {pillar.description}
                    </p>
                  </div>
                  <span 
                    className="text-xs font-mono uppercase inline-flex items-center gap-1 transition-colors"
                    style={{ color: hoveredIndex === i ? '#ffffff' : pillar.color }}
                  >
                    Explore Science <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.div>
              </Link>
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
              description: 'Play is the most important part. It is how kids try new things and learn to love the game. We make a fun, loud space where kids can just play.',
            },
            {
              title: 'LEARN',
              icon: Target,
              color: '#F0E6D3',
              image: '/images/IMG_0312.JPG',
              description: 'Kids learn by doing, not by listening to long talks. We help them make their own choices in games. This helps them build real basketball skills.',
            },
            {
              title: 'GROW',
              icon: Zap,
              color: '#4A7FB5',
              image: '/images/IMG_0481.JPG',
              description: 'Growth is about more than sports. We help kids build confidence, stay strong when things are hard, and work as a team. We build good people first.',
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

      {/* Street Translation Section */}
      <section ref={translationRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={translationVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Basketball Science Explained Like You’re Human</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">STREET </span>
            <span className="gradient-text">TRANSLATION</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Academics love big words. Parents and players want things that make sense. We took the complicated science of learning and translated it into raw, human language.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              jargon: "Constraints-Led Approach",
              translation: "We change the game, not the kid.",
              quote: "Kids learn basketball like they learn to walk or play video games. They try, make mistakes, and try again. Instead of forcing them to move like robots, we change the game setup (like using smaller balls or lower hoops) so they find the right moves naturally.",
              icon: Puzzle,
              color: "#97B3D2"
            },
            {
              jargon: "Differential Learning",
              translation: "The brain loves variety.",
              quote: "If a player does the same drill every time, their brain falls asleep. We add small changes, like using heavier balls or changing where they stand. This forces the brain to stay awake, pay attention, and learn faster.",
              icon: Zap,
              color: "#B0C8E0"
            },
            {
              jargon: "Perception-Action Coupling",
              translation: "Feeling the court.",
              quote: "This is a big term for how your eyes, feet, and brain work together. For example, when kids train in socks, their feet feel the floor better. Their brain gets more information. It is like turning up the touch sensitivity on a game controller so you can play better.",
              icon: Brain,
              color: "#4A7FB5"
            },
            {
              jargon: "Self-Organization",
              translation: "We are gardeners, not puppet masters.",
              quote: "Some coaches try to control every single step, jump, and pass. We do not do that. We set up the game and let kids find their own way to move. We let them grow naturally, like flowers in a garden.",
              icon: Flame,
              color: "#6A9BC7"
            },
            {
              jargon: "The Drill Paradox",
              translation: "Why kids freeze in real games.",
              quote: "Orange cones do not move or play defense. Standard drills teach kids to repeat patterns without thinking. When a real defender stands in front of them in a game, the child freezes. We train with real defenders so kids learn how to react.",
              icon: Target,
              color: "#F0E6D3"
            }
          ].map((item, i) => (
            <motion.div
              key={item.jargon}
              initial={{ opacity: 0, y: 30 }}
              animate={translationVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="glow-card p-8 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-eco-muted line-through">
                    {item.jargon}
                  </span>
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-lg md:text-xl text-white mb-3 uppercase">
                  {item.translation}
                </h3>
                <p className="text-sm text-eco-muted-light leading-relaxed">
                  {item.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section ref={founderRef} className="max-w-6xl mx-auto px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={founderVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glow-card p-8 md:p-12 bg-eco-surface border border-eco-border relative overflow-hidden"
        >
          {/* Quote Banner */}
          <div className="border-b border-white/5 pb-8 mb-8 text-center md:text-left">
            <span className="tag mb-3 inline-block">Meet the Founder</span>
            <h3 className="font-display text-4xl uppercase text-white mb-4">
              COACH ADRIAN
            </h3>
            <p className="text-xl md:text-2xl text-eco-blue leading-relaxed font-heading font-semibold italic max-w-4xl">
              "I did not create EcoHoops for Kids Canada to build professional athletes. I created it to build happy, healthy, and resilient young people."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Image & Roots */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-square w-full">
                <img
                  src="/images/IMG_0281.JPG"
                  alt="Coach Adrian"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-5 rounded-2xl bg-eco-black/40 border border-white/5 space-y-3">
                <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest text-eco-blue">The Roots: Little Burgundy</h4>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  Adrian grew up in Little Burgundy, Montreal, in the 1980s and 1990s. It was a tough neighborhood. Adrian found a safe place and learned how to be a good person by playing sports with kind mentors.
                </p>
              </div>
            </div>

            {/* Right Column: Story Details */}
            <div className="lg:col-span-7 space-y-6 text-sm text-eco-muted-light leading-relaxed">
              <p>
                When Adrian was a teenager, famous sports players from his own neighborhood helped him. They mentored him and taught him how to lead with kindness, order, and respect:
              </p>

              {/* Mentors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-eco-surface2 border border-white/5">
                  <h5 className="font-heading font-bold text-white text-xs uppercase mb-1">
                    Trevor Williams & Wayne Yearwood
                  </h5>
                  <p className="text-[11px] text-eco-muted-light leading-relaxed">
                    Wayne played in the 1988 Olympics. Trevor played against the famous USA "Dream Team" in 1992. Their basketball camps showed Adrian how to build good character in young players.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-eco-surface2 border border-white/5">
                  <h5 className="font-heading font-bold text-white text-xs uppercase mb-1">
                    Alvin Powell
                  </h5>
                  <p className="text-[11px] text-eco-muted-light leading-relaxed">
                    Alvin was a big football player in the NFL. He became a counselor. He spent his life helping kids stay calm and feel safe when life gets too hard.
                  </p>
                </div>
              </div>

              <p>
                Adrian worked hard and became the main point guard for a championship college basketball team. He was named a star player.
              </p>

              <p>
                But Adrian's best skills do not come from books. Members of his own family had hard times with mental health. Adrian spent his life learning how to help and understand people who feel sad, stressed, or scared. This gives him a lot of kindness that you cannot learn in a standard coaching class.
              </p>

              <p>
                At first, Adrian coached the old way. He pushed kids hard. But he saw it made them sad and play with fear. Many kids quit sports by age 13. He decided to change things. He started EcoHoops to mix high-level basketball with kind support and brain science.
              </p>

              <p className="font-semibold text-white">
                When Adrian brings EcoHoops to your facility, he brings the skills of a champion, the street smarts of a tough neighborhood, and a promise to keep every kid happy and safe.
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
