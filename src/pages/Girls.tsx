import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'
import { 
  Heart, ShieldCheck, Sparkles, Award, ArrowRight, Calendar, 
  Target, Users, Zap, DollarSign, ShieldAlert, Brain, ChevronRight, CheckCircle, Smile, Trophy 
} from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Girls() {
  useDocumentTitle('All-Girls Program')
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal(0.05)
  const { ref: realityRef, isVisible: realityVisible } = useScrollReveal(0.1)
  const { ref: pillarsRef, isVisible: pillarsVisible } = useScrollReveal(0.1)
  const { ref: widgetRef, isVisible: widgetVisible } = useScrollReveal(0.1)
  const { ref: divisionsRef, isVisible: divisionsVisible } = useScrollReveal(0.1)
  const { ref: tryoutsRef, isVisible: tryoutsVisible } = useScrollReveal(0.1)
  const { ref: feesRef, isVisible: feesVisible } = useScrollReveal(0.1)
  const { ref: coachingRef, isVisible: coachingVisible } = useScrollReveal(0.1)

  const [activeWidgetTab, setActiveWidgetTab] = useState<'checkin' | 'ratio' | 'mistakes' | 'leaders'>('checkin')
  const [activeCohort, setActiveCohort] = useState<'dev' | 'rep'>('dev')

  const pillars = [
    {
      title: 'Mistake-Friendly Gym',
      desc: 'Zero pressure, zero anxiety. We celebrate mistakes because that’s how skill is built. Girls are free to try new moves without fear of looking bad or getting yelled at.',
      icon: Sparkles,
      color: '#97B3D2'
    },
    {
      title: 'Mentors Who Care & Recruiting Female Coaches',
      desc: 'Coaching focused on athlete confidence, mental wellness, and skill development. We don\'t have female coaches on staff yet, so we are actively recruiting female mentors and role models to join us and lead our girls squads!',
      icon: Award,
      color: '#B0C8E0'
    },
    {
      title: 'Cost is Never a Barrier',
      desc: 'As a nonprofit, we make sure fees are accessible for everyone. We offer extensive subsidies and full sponsorships so every girl has a chance to play.',
      icon: Heart,
      color: '#F0E6D3'
    },
    {
      title: 'Equal Priority',
      desc: 'No second-class status. Our girls\' squads get equal court priority, premium practice times, equal facility access, and full tournament funding.',
      icon: ShieldCheck,
      color: '#4A7FB5'
    }
  ]

  const cohorts = {
    dev: {
      title: "Developmental Girls (Ages 8-11)",
      desc: "Perfect for young players starting their basketball journey. We focus on building fundamental movement literacy (running, decelerating, changing directions) and basketball coordination in a highly supportive, playful atmosphere. We use small-sided games (2v2, 3v3) so every girl gets constant ball touches and decision-making opportunities.",
      focus: "Movement language, fundamental skills, spatial awareness, and confidence building.",
      divisions: "Developmental Girls Training Groups"
    },
    rep: {
      title: "Competitive Rep Girls (2012 Squad)",
      desc: "For players ready to compete at a high level. Our 2012 Girls Rep squad participates in different competitive leagues and tournament showcases across the GTA. We teach the game through ecological dynamics and constraint-led games, forcing players to find creative solutions under pressure rather than memorizing rigid, robotic plays.",
      focus: "Tactical positioning, fast game-reading, defensive intensity, and team self-organization.",
      divisions: "2012 Girls Competitive Rep Team"
    }
  }

  const widgetTabs = {
    checkin: {
      title: "The Emotional Check-In",
      subtitle: "Mental wellness starts before the ball bounces.",
      desc: "Every single training session starts with a 5-minute check-in circle. Coaches ask players how they are feeling, what academic or social stress they are carrying, and what they hope to explore on the court that day. This normalizes expressing feelings, breaks down performance anxiety, and signals that we care about the person before the athlete.",
      points: [
        "Normalizes mental health check-ins directly on the court",
        "Reduces stress from school or social pressure",
        "Builds a safe, empathetic team environment"
      ],
      icon: Brain,
      color: '#97B3D2'
    },
    ratio: {
      title: "The Mentorship Circle",
      subtitle: "Focus on connection and athlete empowerment.",
      desc: "We believe that quality mentorship is the key to athletic longevity. Our sessions are led by certified coaches who act as active advocates for girls in competitive sports, ensuring that every player receives positive reinforcement, individual support, and developmental feedback.",
      points: [
        "Actively recruiting female coaches & role models",
        "Individualized attention for skill development",
        "Small group discussions that build team trust"
      ],
      icon: Users,
      color: '#B0C8E0'
    },
    mistakes: {
      title: "Mistakes as Discovery",
      subtitle: "Eliminating the fear of failure.",
      desc: "Traditional coaching scolds players for turnovers or missed shots. We do the opposite. In our gym, mistakes are welcomed as signs of exploration. We design game constraints that stretch players capabilities, teaching their nervous system to self-organize and adapt under pressure without the fear of being benched.",
      points: [
        "Zero yelling or running punishment laps",
        "Fosters creative play and brave court decisions",
        "Builds resilience on and off the court"
      ],
      icon: Target,
      color: '#F0E6D3'
    },
    leaders: {
      title: "The Leadership Pathway",
      subtitle: "Preparing the next generation to lead.",
      desc: "We don't just teach girls how to play basketball; we prepare them to lead. Older players in our Rep squads are mentored to help run practices for our developmental cohorts, speak at community events, and organize team meetings. They build self-advocacy and communication skills that carry directly into their school and career journeys.",
      points: [
        "Junior coaching opportunities for older players",
        "Develops public speaking and group organization skills",
        "Empowers girls to take control of their athletic experience"
      ],
      icon: Zap,
      color: '#4A7FB5'
    }
  }

  const tryoutCriteria = [
    {
      title: 'Reading the Game',
      desc: 'We want players who attune to open spaces and teammate cutting vectors. We value basketball IQ and court vision over robotic pattern memorization.',
      icon: Target,
      color: '#97B3D2'
    },
    {
      title: 'Defensive Intensity',
      desc: 'Active feet, defensive communication, and high energy. We look for players who take pride in contesting shots and supporting off-ball help lanes.',
      icon: Trophy,
      color: '#6A9BC7'
    },
    {
      title: 'Growth Mindset',
      desc: 'How does a player react to a mistake? We search for players who lift their teammates up, stay positive, and view failure as a step toward learning.',
      icon: Users,
      color: '#B0C8E0'
    },
    {
      title: 'Creative Adaptability',
      desc: 'We value players who try creative finishes, self-organize to solve defensive traps, and adapt on the fly. Creativity is our greatest asset.',
      icon: Zap,
      color: '#4A7FB5'
    }
  ]

  return (
    <div className="pt-28 pb-20 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-24 right-1/4 w-[500px] h-[500px] rounded-full bg-eco-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-16 left-1/4 w-[600px] h-[600px] rounded-full bg-eco-navy/10 blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Hero Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <span className="tag mb-4 inline-block">All Girls Program</span>
            <h1 className="font-display text-hero uppercase mb-6 leading-[0.9] tracking-[0.04em]">
              <span className="text-white">EMPOWERING </span>
              <br />
              <span className="gradient-text">FEMALE ATHLETES</span>
            </h1>
            <p className="text-xl text-eco-muted-light leading-relaxed max-w-2xl">
              Imagine a gym where girls don't just participate—they lead, explore, and thrive. We combine high-level skill acquisition with psychological safety, ensuring every girl builds confidence, handles adversity, and grows as a leader.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <Link to="/register" className="btn-glow inline-flex items-center gap-2 px-6 py-3">
                Register for Tryouts <ArrowRight size={16} />
              </Link>
              <Link to="/teams" className="px-5 py-3 border border-white/10 hover:border-eco-blue/30 bg-eco-surface2/50 rounded-xl text-sm font-heading font-semibold text-white uppercase transition-all duration-300">
                View Girls Rosters
              </Link>
            </div>
          </motion.div>

          {/* Right Hero Polaroid */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 3 }}
            animate={heroVisible ? { opacity: 1, x: 0, rotate: 1 } : {}}
            transition={{ duration: 0.8, type: 'spring' }}
            className="lg:col-span-5 relative bg-white p-4 pb-14 shadow-2xl max-w-sm mx-auto w-full group hover:rotate-[-1deg] hover:scale-105 transition-all duration-300 border border-gray-200"
          >
            {/* Polaroid Tape */}
            <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-28 h-7 bg-white/70 backdrop-blur-md rotate-1 z-10 shadow-sm" />
            
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
              <span className="font-graffiti text-eco-black text-xl tracking-wider block">
                2012 Girls Rep Squad
              </span>
              <span className="text-[9px] text-gray-400 font-heading uppercase tracking-widest mt-0.5 block">
                Mississauga & GTA Competitors
              </span>
            </div>
          </motion.div>

        </div>
      </section>

      <div className="section-divider" />

      {/* The Dropout Reality Check */}
      <section ref={realityRef} className="max-w-7xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={realityVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="tag text-xs bg-red-500/10 border-red-500/20 text-red-400 uppercase tracking-widest font-mono">The Reality Check</span>
            <h2 className="font-display text-section uppercase tracking-tight text-white leading-tight">
              THE SILENT DROPOUT IN YOUTH SPORTS
            </h2>
            <p className="text-eco-muted-light text-base leading-relaxed">
              By the time girls reach the age of 14, they drop out of sports at{' '}
              <a
                href="https://www.womenssportsfoundation.org/do-you-know-the-factors-influencing-girls-participation-in-sports/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-eco-blue-light underline underline-offset-2 hover:text-white transition-colors font-semibold"
              >
                six times the rate of boys
              </a>
              . Why? The research is clear: it isn't a lack of interest. It is a lack of psychological safety, intense competitive pressure, high costs, and systemic neglect of girls' athletic facilities and time slots.
            </p>
            <p className="text-eco-muted-light text-base leading-relaxed">
              EcoHoops was built to rewrite this script. We believe that competitive development doesn't require yelling or fear. We structure our entire Girls program to provide a safe, supportive environment where girls can build life-long motor skills, establish deep peer connections, and lead their own development.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={realityVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 glow-card p-8 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-center"
          >
            <h3 className="font-heading font-bold text-white text-lg mb-6 flex items-center gap-2">
              <Smile className="text-eco-blue" size={20} />
              Our Safe Space Guarantee
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="text-eco-blue mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-eco-muted-light"><strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">Zero Shaming</strong>: Mistakes are treated as progress. We never yell or punish ballers for missed shots.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="text-eco-blue mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-eco-muted-light"><strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">Equal Gym Allocation</strong>: Girls squads receive equal prime-time court bookings and equal facility resources.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="text-eco-blue mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-eco-muted-light"><strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">Dedicated Mentors</strong>: Certified coaches who prioritize emotional health alongside ball skills.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="text-eco-blue mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-eco-muted-light"><strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">Non-profit Scholarships</strong>: Financial aid coordination to ensure fee accessibility for every child.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <div className="section-divider" />

      {/* Four Core Pillars */}
      <section ref={pillarsRef} className="max-w-7xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={pillarsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">The Foundation</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">OUR FOUR </span>
            <span className="gradient-text">PEDAGOGICAL PILLARS</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4">
            How we design our gym to help female athletes discover their confidence and thrive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={pillarsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center mb-4 border border-eco-blue/20">
                    <Icon size={20} style={{ color: pillar.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-md text-white mb-2 uppercase tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-eco-muted-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <div className="section-divider" />

      {/* Interactive Widget: Mentorship & Safe Space Circle */}
      <section ref={widgetRef} className="max-w-6xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center mb-16">
          <span className="tag mb-3 inline-block">Interactive Experience</span>
          <h2 className="font-display text-section uppercase text-white">THE MENTORSHIP & SAFE SPACE CIRCLE</h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4">
            Click through our training principles to see how we build psychological safety and leadership directly into our gym sessions.
          </p>
        </div>

        <div className="glow-card p-6 md:p-8 bg-eco-surface/50 border border-eco-border rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Widget Button Selector (Left) */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {(Object.keys(widgetTabs) as Array<keyof typeof widgetTabs>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveWidgetTab(key)}
                  className={`text-left py-3 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between ${
                    activeWidgetTab === key
                      ? 'bg-eco-blue text-eco-black shadow-glow-sm scale-[1.02]'
                      : 'bg-eco-dark hover:bg-eco-surface border border-white/5 text-eco-muted-light'
                  }`}
                >
                  <span>{widgetTabs[key].title}</span>
                  <ChevronRight size={12} />
                </button>
              ))}
            </div>

            {/* Widget Display Panel (Right) */}
            <div className="lg:col-span-8 space-y-6 lg:pl-8 lg:border-l border-white/5 min-h-[300px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWidgetTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center border"
                      style={{ backgroundColor: `${widgetTabs[activeWidgetTab].color}15`, borderColor: `${widgetTabs[activeWidgetTab].color}30` }}
                    >
                      {(() => {
                        const Icon = widgetTabs[activeWidgetTab].icon
                        return <Icon size={20} style={{ color: widgetTabs[activeWidgetTab].color }} />
                      })()}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white uppercase leading-none">
                        {widgetTabs[activeWidgetTab].title}
                      </h3>
                      <p className="text-xs text-eco-blue font-heading font-semibold mt-1 italic">
                        {widgetTabs[activeWidgetTab].subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-eco-muted-light leading-relaxed">
                    {widgetTabs[activeWidgetTab].desc}
                  </p>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold mb-2">Key Outcomes:</h4>
                    {widgetTabs[activeWidgetTab].points.map((pt, idx) => (
                      <div key={idx} className="flex gap-2 items-center text-xs text-eco-muted-light">
                        <CheckCircle size={14} className="text-eco-blue flex-shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Program Divisions / Cohorts */}
      <section ref={divisionsRef} className="max-w-7xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={divisionsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">The Right Challenge</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">OUR AGE </span>
            <span className="gradient-text">DIVISIONS</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4">
            We structure our programs to ensure players receive the ideal level of physical and tactical challenge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cohorts Tabs Selector */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {(Object.keys(cohorts) as Array<keyof typeof cohorts>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveCohort(key)}
                className={`w-full text-left py-4 px-5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between whitespace-nowrap lg:whitespace-normal ${
                  activeCohort === key
                    ? 'bg-eco-blue text-eco-black shadow-glow-sm scale-[1.02]'
                    : 'bg-eco-surface hover:bg-eco-surface2 border border-white/5 text-eco-muted-light'
                }`}
              >
                <span>{cohorts[key].title}</span>
                <ChevronRight size={12} className="hidden lg:inline" />
              </button>
            ))}
          </div>

          {/* Cohorts Detail Panel */}
          <div className="lg:col-span-8 glow-card p-8 bg-eco-surface border border-eco-border rounded-2xl min-h-[260px] flex flex-col justify-between">
            <div>
              <span className="tag text-[10px] bg-eco-blue/10 border-eco-blue/20 text-eco-blue mb-4 inline-block uppercase tracking-wider font-mono">
                {cohorts[activeCohort].divisions}
              </span>
              <h3 className="font-heading font-bold text-xl uppercase text-white mb-3">
                {cohorts[activeCohort].title}
              </h3>
              <p className="text-sm text-eco-muted-light leading-relaxed mb-6">
                {cohorts[activeCohort].desc}
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex gap-2 items-center text-xs text-eco-blue font-heading font-bold">
              <Sparkles size={14} />
              <span>Core Focus: {cohorts[activeCohort].focus}</span>
            </div>
          </div>

        </div>
      </section>

      <div className="section-divider" />

      {/* Tryout Schedules */}
      <section ref={tryoutsRef} className="max-w-6xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={tryoutsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glow-card p-8 md:p-12 border border-eco-blue/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Tryout Calendar Details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="tag inline-block">Join the Squads</span>
              <h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide">
                TRYOUT INFO & SCHEDULES
              </h2>
              
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-xl bg-eco-black/40 border border-white/5 flex gap-4 items-start">
                  <Calendar className="text-eco-blue flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm uppercase">Fall Rep tryouts</h4>
                    <p className="text-xs text-eco-muted-light mt-1">
                      Late August to Early September. Build competitive rosters for the Fall/Winter GTA competitive league play.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-eco-black/40 border border-white/5 flex gap-4 items-start">
                  <Calendar className="text-eco-blue flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm uppercase">Spring Select tryouts</h4>
                    <p className="text-xs text-eco-muted-light mt-1">
                      Late March to Early April. Build teams for regional GTA Spring/Summer showcase runs.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-eco-muted leading-relaxed">
                Practices are held at local schools and community gym facilities in Mississauga and surrounding GTA centers. Registered ballers receive exact schedules, gym locations, and calendar alerts.
              </p>
            </div>

            {/* Selection Criteria */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-heading font-bold text-white text-xs uppercase tracking-widest text-eco-blue border-b border-white/5 pb-2">
                What Our Coaches Look For:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tryoutCriteria.map((crit) => {
                  const Icon = crit.icon
                  return (
                    <div key={crit.title} className="p-4 rounded-xl bg-eco-surface2 border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center border"
                          style={{ backgroundColor: `${crit.color}15`, borderColor: `${crit.color}30` }}
                        >
                          <Icon size={14} style={{ color: crit.color }} />
                        </div>
                        <h4 className="font-heading font-bold text-white text-xs uppercase">{crit.title}</h4>
                      </div>
                      <p className="text-[11px] text-eco-muted-light leading-relaxed">
                        {crit.desc}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      <div className="section-divider" />

      {/* Tuition Fee Structure */}
      <section ref={feesRef} className="max-w-5xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={feesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">No Hidden Costs</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">TRANSPARENT </span>
            <span className="gradient-text">FEE STRUCTURE</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4">
            We list all pricing upfront. We have no hidden tournament fees, and parents do not need to fundraise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Tuition Inclusions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={feesVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="glow-card p-8 bg-eco-surface border border-eco-border rounded-2xl lg:col-span-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wide mb-6 pb-2 border-b border-white/5">
                What Your Tuition Covers
              </h3>
              
              <ul className="space-y-4 text-sm text-eco-muted-light">
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-eco-blue/10 flex items-center justify-center text-eco-blue font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>Weekly Practices:</strong> Two gym practices every week (90 minutes each) in community center gyms.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-eco-blue/10 flex items-center justify-center text-eco-blue font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>GTA Tournaments:</strong> Tournament fees for different competitive league and regional showcase events (minimum 12 games).</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-eco-blue/10 flex items-center justify-center text-eco-blue font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>Rep Gear Package:</strong> Home and away jerseys, shorts, team hoodie, and a customized gear bag.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-eco-blue/10 flex items-center justify-center text-eco-blue font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>Safe Coaching:</strong> Background-checked coaches trained in first-aid, motor learning, and mental health.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-eco-blue/10 flex items-center justify-center text-eco-blue font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>Player Insurance:</strong> Full registration, liability, and athletic safety insurance coverages.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2 text-eco-muted text-xs uppercase tracking-wider">
                <ShieldAlert size={16} className="text-eco-blue-light" />
                <span>Financial Subsidies & Grants</span>
              </div>
              <p className="text-xs text-eco-muted-light max-w-sm leading-relaxed">
                As a federal non-profit, we help parents coordinate funding from programs like Jumpstart, KidSport, and local aid groups. Contact our staff to learn more.
              </p>
            </div>
          </motion.div>

          {/* Tuition Price Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={feesVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-eco-surface border border-eco-blue/20 rounded-2xl p-8 flex flex-col justify-between text-center lg:col-span-4 shadow-glow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-eco-blue/5 blur-[30px] rounded-full" />
            
            <div>
              <span className="bg-eco-blue/10 border border-eco-blue/20 text-eco-blue text-[10px] font-mono uppercase px-2 py-1 rounded inline-block mb-4">
                Full-Season Program
              </span>
              <h4 className="font-heading font-semibold text-eco-muted-light text-sm uppercase tracking-wider mb-2">Tuition Fee</h4>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-xl font-heading font-bold text-eco-muted">$</span>
                <span className="text-5xl font-display text-white">1,850</span>
                <span className="text-sm font-heading font-semibold text-eco-muted">CAD</span>
              </div>
              <p className="text-xs text-eco-muted mb-6">Interest-free payment installments available</p>
            </div>

            <div className="space-y-4">
              <div className="text-left text-xs bg-eco-black/40 border border-white/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-white font-semibold">
                  <span>Registration Deposit (Sept 1st)</span>
                  <span>$350</span>
                </div>
                <div className="flex justify-between text-eco-muted-light">
                  <span>Installment #1 (Oct 1st)</span>
                  <span>$300</span>
                </div>
                <div className="flex justify-between text-eco-muted-light">
                  <span>Installment #2 (Nov 1st)</span>
                  <span>$300</span>
                </div>
                <div className="flex justify-between text-eco-muted-light">
                  <span>Installment #3 (Dec 1st)</span>
                  <span>$300</span>
                </div>
                <div className="flex justify-between text-eco-muted-light">
                  <span>Installment #4 (Jan 1st)</span>
                  <span>$300</span>
                </div>
                <div className="flex justify-between text-eco-muted-light">
                  <span>Installment #5 (Feb 1st)</span>
                  <span>$300</span>
                </div>
              </div>
              
              <Link to="/register" className="btn-glow block w-full text-center py-3 text-xs">
                Register Player
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      <div className="section-divider" />

      {/* Recruiting Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-10 relative z-10">
        <div className="glow-card p-8 md:p-10 border border-eco-blue/20 bg-gradient-to-br from-eco-surface to-eco-surface2 text-center rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-eco-blue/5 blur-[40px] rounded-full pointer-events-none" />
          <Users size={32} className="text-eco-blue mx-auto mb-4" />
          <span className="tag text-[10px] bg-eco-blue/10 border-eco-blue/20 text-eco-blue mb-3 inline-block uppercase tracking-wider font-mono">Join Our Team</span>
          <h3 className="font-display text-2xl md:text-3xl text-white uppercase mb-3">WE NEED COACHES—ESPECIALLY FEMALE MENTORS!</h3>
          <p className="text-sm text-eco-muted-light max-w-2xl mx-auto mb-6 leading-relaxed">
            EcoHoops is a young, rapidly growing organization founded in 2024. As we expand our girls programs in Mississauga, we are actively looking for passionate role models to join our coaching staff. We are especially seeking <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">female coaches and mentors</strong> who want to guide, inspire, and advocate for young athletes on and off the court.
          </p>
          <Link to="/contact" className="btn-glow inline-flex items-center gap-2 px-6 py-3">
            Apply to Coach With Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div className="section-divider" />

      {/* Coaching Standards / Philosophical Pedigree */}
      <section ref={coachingRef} className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={coachingVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="glow-card p-8 md:p-12 relative overflow-hidden"
        >
          <Award size={48} className="text-eco-blue/30 mx-auto mb-6" />
          <h2 className="font-display text-section uppercase text-white mb-4">
            PEDAGOGICAL LEADERSHIP
          </h2>
          <p className="text-eco-muted-light max-w-2xl mx-auto mb-8 leading-relaxed text-sm md:text-base">
            We believe that a coach's role is to act as a supportive guide rather than a commander. As our Girls program expands, we are actively recruiting dedicated female coaches and mentors to join our coaching staff, combining positive player development with youth mental health advocacy.
            <br /><br />
            We guard our pedagogical standards fiercely: zero shouting, zero public scolding, and complete prioritization of player confidence and agency.
          </p>

          <Link to="/philosophy" className="btn-glow inline-flex items-center gap-2 px-8 py-3">
            Read Our Pedagogical Philosophy <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
