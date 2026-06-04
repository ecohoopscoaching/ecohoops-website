import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Heart, Brain, Users, HandHeart, Sparkles, Lightbulb, Zap, Layers, Quote } from 'lucide-react'

export default function Nonprofit() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="tag mb-4 inline-block">Our Foundation</span>
          <h1 className="font-display text-section uppercase tracking-tight mb-6">
            <span className="text-white">MORE THAN </span>
            <span className="gradient-text">BASKETBALL</span>
          </h1>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto">
            EcoHoops is a registered nonprofit organization dedicated to building resilient youth through sport. We believe in providing accessible basketball programming while actively prioritizing mental wellness.
          </p>
        </motion.div>

        {/* Mental Health Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-28">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-eco-orange/10 flex items-center justify-center">
                <Brain className="text-eco-orange" size={24} />
              </div>
              <h2 className="font-display text-3xl text-white uppercase">Mental Health Focus</h2>
            </div>
            <p className="text-eco-muted-light mb-8 leading-relaxed">
              Youth sports have become increasingly specialized and high-pressure. We combat athlete burnout, anxiety, and depression by normalizing mental health conversations both on and off the court.
            </p>

            <div className="glow-card p-8 border-l-4 border-eco-orange relative overflow-hidden mb-10">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={80} className="text-eco-orange" />
              </div>
              
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-eco-orange mb-6 flex items-center gap-2">
                The Foundation: UN Convention Article 31
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <span className="text-eco-orange font-display text-2xl opacity-50">01</span>
                  <p className="text-sm text-white/90 leading-relaxed italic">
                    "States Parties recognize the right of the child to rest and leisure, to engage in play and recreational activities appropriate to the age of the child and to participate freely in cultural life and the arts."
                  </p>
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <span className="text-eco-orange font-display text-2xl opacity-50">02</span>
                  <p className="text-sm text-white/90 leading-relaxed italic">
                    "States Parties shall respect and promote the right of the child to participate fully in cultural and artistic life and shall encourage the provision of appropriate and equal opportunities for cultural, artistic, recreational and leisure activity."
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-eco-muted uppercase tracking-widest">United Nations Convention on the Rights of the Child</span>
                <a 
                  href="https://www.unicef.org/child-rights-convention/convention-text" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-eco-orange hover:text-white underline underline-offset-4 transition-colors font-bold uppercase tracking-widest"
                >
                  View Full Document
                </a>
              </div>
            </div>
            <ul className="space-y-4">
              {[
                'Monthly mental wellness workshops for all age groups',
                'Coaches trained in mental health first aid',
                'Partnerships with professional sports psychologists',
                'Focus on psychological safety over "win at all costs"'
              ].map((item, i) => (
                <li key={i} className="flex flex-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Sparkles size={16} className="text-eco-orange" />
                  </div>
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="order-1 lg:order-2 glow-card aspect-square max-h-[500px] overflow-hidden rounded-3xl"
          >
            <img 
              src="/images/13.png" 
              alt="Mental health workshop"
              className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" 
            />
          </motion.div>
        </div>

        {/* Science of Play Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-28"
        >
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-3xl bg-eco-blue/10 flex items-center justify-center">
                <Lightbulb className="text-eco-blue" size={32} />
              </div>
            </div>
            <h2 className="font-display text-4xl text-white uppercase mb-4">The Science of Play</h2>
            <p className="text-eco-muted-light max-w-2xl mx-auto italic">
              "The opposite of play is not work, it's depression." — Dr. Stuart Brown, National Institute for Play
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="glow-card p-10 text-center col-span-1 md:col-span-3">
              <h3 className="text-2xl font-display text-white uppercase mb-6 flex items-center justify-center gap-3">
                <Zap className="text-eco-orange" size={24} />
                The Play State
              </h3>
              <p className="text-eco-muted-light leading-relaxed max-w-3xl mx-auto">
                Scientific research shows that play is a biological necessity. When a child enters "The Play State," neurons across the midbrain light up, establishing new neural pathways that create physical agility, social confidence, and emotional regulation.
              </p>
            </div>
            {[
              { title: 'Self-Directed', desc: 'Players choose and direct the activity themselves, leading to deeper engagement.' },
              { title: 'Intrinsically Motivated', desc: 'The activity is done for internal satisfaction rather than external rewards or fear.' },
              { title: 'Structured', desc: 'Play follows rules that exist in the player’s mind, encouraging logic and discipline.' },
              { title: 'Imaginative', desc: 'A creative aspect that allows for experimentation without real-world consequences.' },
              { title: 'Active Engagement', desc: 'Total absorption where time seems to stop, building intense focus and flow.' }
            ].map((element, i) => (
              <div key={i} className={`bg-eco-surface2 p-8 rounded-3xl border border-eco-border hover:border-eco-blue/50 transition-colors ${i === 3 || i === 4 ? 'md:col-span-1.5' : ''}`}>
                <div className="text-eco-blue font-display text-xl mb-3 flex items-center gap-3">
                  <span className="opacity-30 text-2xl">{i + 1}</span>
                  {element.title}
                </div>
                <p className="text-sm text-eco-muted-light leading-relaxed">{element.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-eco-blue/5 border border-eco-blue/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Layers className="text-eco-blue" size={48} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white mb-2 uppercase tracking-wider">Wiring the Brain</h4>
              <p className="text-sm text-eco-muted-light leading-relaxed">
                Because basketball at EcoHoops is designed as **Free Play**, it establishes connections in the cortex that are critical for youth development. The more often children are in a play state, the more they build the skills used for a lifetime: resilience, creativity, and equanimity.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Nonprofit Status Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="glow-card aspect-[4/3] overflow-hidden rounded-3xl"
          >
            <img 
              src="/images/11.png" 
              alt="Community program"
              className="w-full h-full object-cover saturate-50 hover:saturate-100 transition-all duration-700" 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-eco-blue/10 flex items-center justify-center">
                <Heart className="text-eco-blue" size={24} />
              </div>
              <h2 className="font-display text-3xl text-white uppercase">Our Legal Foundation</h2>
            </div>
            <p className="text-eco-muted-light mb-8 leading-relaxed">
              EcoHoops operates under a unique, transparent dual-structure that ensures we provide high-quality training infrastructure while remaining fully dedicated to community access and social impact.
            </p>

            <div className="space-y-4">
              {/* For-profit card */}
              <div className="bg-eco-surface2 p-5 rounded-2xl border border-eco-border relative overflow-hidden group hover:border-eco-blue/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-white text-base">EcoHoops Inc.</h3>
                  <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-eco-blue/10 border border-eco-blue/30 text-eco-blue-light font-bold">
                    For-Profit
                  </span>
                </div>
                <p className="text-[10px] text-eco-muted mb-2 font-mono">INCORPORATED: SEP 11, 2024</p>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  The central engine driving advanced training, development programs, facility leases, equipment procurement, and professional operations.
                </p>
              </div>

              {/* Non-profit card */}
              <div className="bg-eco-surface2 p-5 rounded-2xl border border-eco-border relative overflow-hidden group hover:border-eco-orange/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-white text-base">EcoHoops for Kids Canada</h3>
                  <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-eco-orange/10 border border-eco-orange/30 text-eco-orange font-bold">
                    Federal Non-Profit
                  </span>
                </div>
                <p className="text-[10px] text-eco-muted mb-2 font-mono">INCORPORATED: JUL 31, 2025</p>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  Our dedicated federal non-profit organization focused entirely on accessible grassroots programs, mental health check-ins, financial aid subsidies, and community giveaways.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
