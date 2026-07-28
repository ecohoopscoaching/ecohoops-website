import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { PILLARS } from '../data/content'
import { PHILOSOPHY_CONTENT } from '../data/content'
import { Zap, Puzzle, Flame, Brain, BookOpen, Heart, Target, Quote, ArrowRight, Shuffle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Puzzle, Flame, Brain, Shuffle, TrendingUp,
}

export default function Philosophy() {
  useDocumentTitle('Pedagogical Philosophy')
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
          <span className="tag mb-4 inline-block">The Parent Translation Dictionary</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">PARENT-FIRST </span>
            <span className="gradient-text">TRANSLATION DICTIONARY</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-3xl mx-auto mt-4 leading-relaxed">
            Coaches and academics love big terms. Parents and players want real outcomes that show up on game day. We translate complex motor learning science into plain language that parents standing at pickup can immediately understand.
          </p>
        </motion.div>

        {/* Positioning Statement Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={translationVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 p-8 md:p-10 rounded-2xl bg-gradient-to-r from-eco-surface via-eco-navy/30 to-eco-surface border border-eco-blue/30 relative overflow-hidden shadow-glow-sm"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-eco-blue/10 blur-3xl rounded-full pointer-events-none" />
          <span className="text-xs font-mono uppercase text-eco-blue font-bold tracking-widest block mb-2">
            The EcoHoops Positioning Promise
          </span>
          <p className="font-heading font-semibold text-lg md:text-xl text-white leading-relaxed italic">
            "EcoHoops helps players become smarter, more confident competitors by teaching basketball the way it's actually played. Our practices are built around real game situations, so learning sticks, improvement transfers to games, and players develop faster where it matters most. We don't just build better basketball players. We build competitors who can think, adapt, and perform under pressure."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              jargon: "Ecological Dynamics",
              translation: "We help players become smarter on the court",
              quote: "Instead of memorizing plays by rote, players read defender spacing, make instant split-second decisions, and develop true court IQ.",
              icon: Zap,
              color: "#B0C8E0"
            },
            {
              jargon: "Differential Learning",
              translation: "We help players adapt instead of panic",
              quote: "We introduce variability in footwork, speeds, and ball weights so players handle unexpected game situations without freezing.",
              icon: Shuffle,
              color: "#4A7FB5"
            },
            {
              jargon: "Constraints-Led Approach",
              translation: "We teach kids to solve problems on their own",
              quote: "By altering defender rules, court size, or scoring rules, players naturally discover optimal solutions rather than copying rigid drill steps.",
              icon: Puzzle,
              color: "#97B3D2"
            },
            {
              jargon: "Game-based learning",
              translation: "Everything we do shows up in real games",
              quote: "No static cone drills. Practice scenarios mirror full-speed game context so skills transfer seamlessly when referee whistles blow.",
              icon: Target,
              color: "#F0E6D3"
            },
            {
              jargon: "Perception-action coupling",
              translation: "Reading the game",
              quote: "Training eyes, brain, and body to act together so players see open lanes, passing windows, and defensive rotations early.",
              icon: Brain,
              color: "#6A9BC7"
            },
            {
              jargon: "Affordances",
              translation: "Seeing opportunities",
              quote: "Teaching players to recognize gaps in defense, mismatch angles, and scoring opportunities before the defense reacts.",
              icon: Heart,
              color: "#85A4C4"
            },
            {
              jargon: "Emergence",
              translation: "Players figure it out",
              quote: "Creating guided game environments where player creativity and instinct flourish naturally without micromanagement.",
              icon: Flame,
              color: "#6A9BC7"
            },
            {
              jargon: "Representative learning design",
              translation: "Practice looks like the game",
              quote: "Every drill includes decision-making, live defender pressure, and spatial constraints that mirror actual competition.",
              icon: TrendingUp,
              color: "#B0C8E0"
            }
          ].map((item, i) => (
            <motion.div
              key={item.jargon}
              initial={{ opacity: 0, y: 20 }}
              animate={translationVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className="glow-card p-6 bg-eco-surface border border-eco-border rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-eco-muted line-through">
                    {item.jargon}
                  </span>
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}
                  >
                    <item.icon size={16} style={{ color: item.color }} />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-2 leading-snug">
                  "{item.translation}"
                </h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
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
                <strong>Adrian Sapp</strong> didn't just study basketball; he lived it at the <strong>highest level</strong>. He was one of the top high school players in Montreal, earning <strong>All-Star</strong> honors at Westmount High before moving on to Vanier College's <strong>elite AAA program</strong>. During the legendary 2004-2005 season, Adrian earned All-Star honors while leading Vanier to a <strong>Provincial Championship</strong> and a trip to the Nationals, where he was named a <strong>2nd Team All-Canadian</strong>. When it comes to skill development and understanding the true flow of the game, Adrian brings the <strong>proven execution of a champion</strong>. He knows exactly what it takes to perform under pressure because he has actually done it.
              </p>

              <p>
                But his deep understanding of youth development wasn't just built in a gym. Adrian grew up in <strong>Little Burgundy</strong>, a tough Montreal neighborhood where poverty and crime were daily realities. Raised by a single mother, his childhood was a high-pressure environment, made more difficult by severe <strong>mental health struggles</strong> within his own family. He knows firsthand what it feels like to navigate stress, trauma, and uncertainty as a kid.
              </p>

              <p>
                During those critical teenage years, local sports legends stepped in to guide him, including Olympian <strong>Wayne Yearwood</strong> and former NFL player turned counselor <strong>Alvin Powell</strong>. But it was Montreal basketball icon <strong>Trevor Williams</strong> who left the biggest blueprint. Trevor famously played against Michael Jordan and the 1992 USA Dream Team. Watching Trevor build his summer camps and grow his kids' foundation showed Adrian exactly how a leader can become a <strong>positive pillar in the community</strong>. Trevor didn't just teach basketball; he showed Adrian how to use the game to <strong>protect youth, build character, and give kids a safe place to land</strong>.
              </p>

              <p>
                The crazy part is that Adrian didn't grow up being coached in a rigid system. He never even played organized basketball until he was 13 at the local high school. Instead, he earned his stripes playing <strong>raw streetball</strong>, competing in tough adult men's leagues starting at just 14 years old, and training entirely by himself for hours on the blacktop in the early mornings.
              </p>

              <p>
                Yet, early in his coaching career, Adrian fell right into the <strong>traditional sports trap</strong>. He used heavy pressure, yelling, and the typical grind culture. But he saw the damage it caused. He watched kids <strong>play with fear</strong>, lose their love for the game, and quit sports entirely.
              </p>

              <p>
                Adrian admitted he was wrong, turned his back on that toxic environment, and changed his approach. He founded <strong>ECOHOOPS</strong> to fix a broken youth sports system.
              </p>

              <p>
                Today, Adrian does things differently. He sets up the court so kids can figure things out on their own, the same way he learned on the playground. He does not treat kids like robots. He holds players accountable, but his ultimate goal is to help kids <strong>grow as whole people</strong>, have fun, and fall in love with the game. When you bring your child to ECOHOOPS, you are getting a <strong>real mentor</strong> who has been there, done that, and made it his life mission to keep your kid <strong>happy, safe, and growing</strong>.
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
