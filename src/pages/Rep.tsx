import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Trophy, Calendar, Users, DollarSign, ShieldAlert, Award, ArrowRight, Zap, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Rep() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal(0.05)
  const { ref: divisionsRef, isVisible: divisionsVisible } = useScrollReveal(0.1)
  const { ref: tryoutsRef, isVisible: tryoutsVisible } = useScrollReveal(0.1)
  const { ref: feesRef, isVisible: feesVisible } = useScrollReveal(0.1)
  const { ref: coachingRef, isVisible: coachingVisible } = useScrollReveal(0.1)

  const divisions = [
    {
      age: 'U10 & U11',
      name: 'Developmental Rep',
      focus: 'Basic Spacing & Reading the Game',
      desc: 'We help young players start playing in real games without stress. We use fun rules to teach **spacing** (which means **standing in the right places**) and **game-reading** (which means **understanding what is happening in the game**).'
    },
    {
      age: 'U12 & U13',
      name: 'Transitional Rep',
      focus: 'Smart Game Rules & Speed Control',
      desc: 'We teach kids how to run fast when they get the ball (**transition**) and how to play defense. Players learn to handle hard times (**adversity**) and **self-organize** (which means **solving problems on the court together without a coach telling them what to do**).'
    },
    {
      age: 'U14 & U15',
      name: 'Performance Rep',
      focus: 'Fast Decisions & High-Energy Play',
      desc: 'We play in big tournaments. We use faster games and different rules to help players make quick choices when defenders are pressing them hard.'
    },
    {
      age: 'U16 & U17',
      name: 'Varsity Prep',
      focus: 'Big Games & Leadership Skills',
      desc: 'We prepare players for high school and college teams. We focus on **tactical** play (which means **making smart team moves**) and building **resilience** (which means **staying strong and not giving up**).'
    }
  ]

  const tryoutCriteria = [
    {
      title: 'Reading the Game',
      desc: 'We want players who can see the open spaces and make quick choices. We do not want players who just move like robots.',
      icon: Target,
      color: '#97B3D2'
    },
    {
      title: 'Defensive Hustle',
      desc: 'We look for active feet, talking on defense, and trying hard to block shots. Energy on defense is very important to us.',
      icon: Trophy,
      color: '#6A9BC7'
    },
    {
      title: 'Growth Mindset',
      desc: 'We watch how a player acts after they miss a shot. We want players who help their teammates and learn from their mistakes.',
      icon: Users,
      color: '#B0C8E0'
    },
    {
      title: 'Creativity',
      desc: 'We look for players who try new ways to score, adapt to the other team, and solve problems. We want creative thinkers.',
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 relative z-10"
          >
            <span className="tag mb-4 inline-block">EcoHoops Rep Teams</span>
            <h1 className="font-display text-hero uppercase mb-6 leading-[0.9] tracking-[0.04em]">
              <span className="text-white">COMPETITIVE SQUADS,</span>
              <br />
              <span className="gradient-text">ZERO TOXICITY</span>
            </h1>
            <p className="text-xl text-eco-muted-light leading-relaxed">
              We show that kids can play at a high level and win games without hurting their mental health. We have high goals and give kids complete support.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <Link to="/register" className="btn-glow inline-flex items-center gap-2 px-6 py-3">
                Register for Tryouts <ArrowRight size={16} />
              </Link>
              <Link to="/teams" className="px-5 py-3 border border-white/10 hover:border-eco-blue/30 bg-eco-surface2/50 rounded-xl text-sm font-heading font-semibold text-white uppercase transition-all duration-300">
                View Active Squads
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative rounded-2xl overflow-hidden h-[300px] lg:h-[400px] z-0"
          >
            <img
              src="/images/IMG_0312.JPG"
              alt="EcoHoops Rep game action"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-eco-black/50 via-transparent to-eco-navy/20" />
            <div className="absolute inset-0 rounded-2xl border border-eco-blue/10" />
          </motion.div>
        </div>
      </section>

      {/* Divisions Section */}
      <section ref={divisionsRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={divisionsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Divisions</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">COMPETITIVE </span>
            <span className="gradient-text">BRACKETS</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Our teams participate in Ontario Basketball Association (OBA) leagues and regional tournaments across the Greater Toronto Area.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {divisions.map((division, idx) => (
            <motion.div
              key={division.age}
              initial={{ opacity: 0, y: 20 }}
              animate={divisionsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glow-card p-8 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xl sm:text-2xl font-display text-white tracking-wide">{division.age}</span>
                  <span className="bg-eco-blue/10 border border-eco-blue/20 text-eco-blue text-[10px] uppercase font-mono px-2 py-1 rounded">
                    OBA Registered
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#97B3D2] uppercase tracking-wide mb-2">
                  {division.name}
                </h3>
                <p className="text-xs font-mono uppercase text-eco-muted tracking-wider mb-4">
                  Focus: {division.focus}
                </p>
                <p className="text-sm text-eco-muted-light leading-relaxed">
                  {division.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tryouts Section */}
      <section ref={tryoutsRef} className="max-w-6xl mx-auto px-6 lg:px-8 mb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={tryoutsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glow-card p-8 md:p-12 border border-[#97B3D2]/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Tryout Schedules */}
            <div className="lg:col-span-5 space-y-6">
              <span className="tag inline-block">Join the Squads</span>
              <h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide">
                TRYOUT INFO & SCHEDULES
              </h2>
              
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-xl bg-eco-black/40 border border-white/5 flex gap-4 items-start">
                  <Calendar className="text-eco-blue flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm uppercase">Fall Rep Tryouts</h4>
                    <p className="text-xs text-eco-muted-light mt-1">
                      Late August to Early September. Selects rosters for the Fall/Winter OBA competitive runs.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-eco-black/40 border border-white/5 flex gap-4 items-start">
                  <Calendar className="text-eco-blue flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm uppercase">Spring Select Tryouts</h4>
                    <p className="text-xs text-eco-muted-light mt-1">
                      Late March to Early April. Rosters built for local Spring/Summer showcase tournaments.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-eco-muted leading-relaxed">
                Practices are held at local schools and community gyms in Mississauga and surrounding GTA facilities. Registered players receive notifications for exact dates, times, and gym allocations.
              </p>
            </div>

            {/* Selection Criteria */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-heading font-bold text-white text-xs uppercase tracking-widest text-[#97B3D2] border-b border-white/5 pb-2">
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

      {/* Fee Structure Section */}
      <section ref={feesRef} className="max-w-5xl mx-auto px-6 lg:px-8 mb-28 relative z-10">
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
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4 leading-relaxed">
            We show you the exact price. We do not have hidden fees, and parents do not have to sell chocolate or raise money.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Tuition Package Details */}
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
                  <div className="w-5 h-5 rounded-full bg-[#97B3D2]/10 flex items-center justify-center text-[#97B3D2] font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>Weekly Practices:</strong> Two gym practices every week (90 minutes each) in local community gyms.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-[#97B3D2]/10 flex items-center justify-center text-[#97B3D2] font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>GTA Tournaments:</strong> Fees for four weekend tournaments (at least 12 games total).</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-[#97B3D2]/10 flex items-center justify-center text-[#97B3D2] font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>Rep Gear Package:</strong> Home and away jerseys, shorts, shirts, and a bag.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-[#97B3D2]/10 flex items-center justify-center text-[#97B3D2] font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>Player Insurance:</strong> All registration and safety insurance fees are covered.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-[#97B3D2]/10 flex items-center justify-center text-[#97B3D2] font-bold text-xs flex-shrink-0 mt-0.5">✓</div>
                  <span><strong>Safe Coaching:</strong> Background-checked coaches trained in first-aid and youth mental health.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2 text-eco-muted text-xs uppercase tracking-wider">
                <ShieldAlert size={16} className="text-eco-blue-light" />
                <span>Scholarships & subsidies available</span>
              </div>
              <p className="text-xs text-eco-muted-light max-w-sm leading-relaxed">
                As a community-focused non-profit, we partner with programs like Jumpstart and KidSport. Contact our staff to coordinate financial assistance.
              </p>
            </div>
          </motion.div>

          {/* Pricing Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={feesVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-eco-surface border border-eco-blue/20 rounded-2xl p-8 flex flex-col justify-between text-center lg:col-span-4 shadow-glow-sm relative overflow-hidden"
          >
            {/* Ambient tag glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-eco-blue/5 blur-[30px] rounded-full" />
            
            <div>
              <span className="bg-eco-blue/10 border border-eco-blue/20 text-eco-blue text-[10px] font-mono uppercase px-2 py-1 rounded inline-block mb-4">
                Full-Season Package
              </span>
              <h4 className="font-heading font-semibold text-eco-muted-light text-sm uppercase tracking-wider mb-2">Tuition Fee</h4>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-xl font-heading font-bold text-eco-muted">$</span>
                <span className="text-5xl font-display text-white">1,850</span>
                <span className="text-sm font-heading font-semibold text-eco-muted">CAD</span>
              </div>
              <p className="text-xs text-eco-muted mb-6">Payment installment structures available</p>
            </div>

            <div className="space-y-4">
              <div className="text-left text-xs bg-eco-black/40 border border-white/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-white font-semibold">
                  <span>Registration Deposit</span>
                  <span>$350</span>
                </div>
                <div className="flex justify-between text-eco-muted-light">
                  <span>Installment #1 (Oct)</span>
                  <span>$500</span>
                </div>
                <div className="flex justify-between text-eco-muted-light">
                  <span>Installment #2 (Dec)</span>
                  <span>$500</span>
                </div>
                <div className="flex justify-between text-eco-muted-light">
                  <span>Installment #3 (Feb)</span>
                  <span>$500</span>
                </div>
              </div>
              
              <Link to="/register" className="btn-glow block w-full text-center py-3 text-xs">
                Register Player
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coaching & Mentorship Philosophy Section */}
      <section ref={coachingRef} className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={coachingVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="glow-card p-8 md:p-12 relative overflow-hidden"
        >
          <Award size={48} className="text-[#97B3D2]/30 mx-auto mb-6" />
          <h2 className="font-display text-section uppercase text-white mb-4">
            OUR COACHING STANDARDS
          </h2>
          <p className="text-eco-muted-light max-w-2xl mx-auto mb-8 leading-relaxed text-sm md:text-base">
            We want our players to try their hardest. Our coaches do not yell to make kids feel bad. Sometimes coaches speak loudly to get kids focused, but they are always kind and supportive.
            <br /><br />
            Please note: for older kids, not everyone plays the same amount of time. Everyone is treated **FAIRLY** (which means **with respect**), but not **EQUALLY** (which means **some will play more than others**). Playing time is earned by showing up to practice, working hard on defense, and developing skills.
          </p>

          <Link to="/philosophy" className="btn-glow inline-flex items-center gap-2 px-8 py-3">
            Read Our Pedagogical Philosophy <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
