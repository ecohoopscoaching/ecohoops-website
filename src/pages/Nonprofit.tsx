import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { 
  Heart, Brain, Users, HandHeart, Sparkles, Lightbulb, Zap, Layers, Quote,
  Building2, ShieldCheck, Globe, Calendar, FileText 
} from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Nonprofit() {
  useDocumentTitle('EcoHoops for Kids Canada | Canadian Youth Basketball Nonprofit', {
    raw: true,
    metaDescription: 'EcoHoops for Kids Canada is a federally incorporated Canadian nonprofit organization providing youth basketball and community programming through the EcoHoops brand.',
  })
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block !bg-[#003366]/80 !border-[#97B3D2]/40 !text-[#97B3D2]">
            Official Nonprofit Entity
          </span>
          <h1 className="font-display text-section uppercase tracking-tight mb-6">
            <span className="text-white">ECOHOOPS FOR KIDS </span>
            <span className="gradient-text">CANADA</span>
          </h1>
          <p className="text-eco-muted-light text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            EcoHoops for Kids Canada is a federally incorporated Canadian nonprofit organization operating under the EcoHoops brand. Ecohoops.ca serves as the official website and web presence for EcoHoops for Kids Canada and its nonprofit youth programs.
          </p>
          <p className="text-sm text-eco-muted max-w-2xl mx-auto">
            We help kids grow strong, healthy, and resilient through youth basketball programming, community open gyms, equipment support, all-girls sports initiatives, financial assistance, and mental health education.
          </p>
        </motion.div>

        {/* Organization Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-4xl mx-auto mb-20 glow-card p-6 sm:p-8 bg-eco-surface/90 border border-eco-blue/30 rounded-3xl relative overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-eco-blue block mb-1">
                Official Entity Information
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                EcoHoops for Kids Canada / EcoHoops pour Enfants Canada
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-eco-blue/10 border border-eco-blue/30 text-eco-blue text-xs font-mono font-semibold uppercase tracking-wider self-start sm:self-auto">
              Federal Nonprofit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-eco-muted text-xs uppercase tracking-wider font-mono">
                <Building2 size={14} className="text-eco-blue" />
                <span>Entity Type</span>
              </div>
              <p className="text-sm font-semibold text-white">
                Federally incorporated Canadian nonprofit corporation
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-eco-muted text-xs uppercase tracking-wider font-mono">
                <FileText size={14} className="text-eco-blue" />
                <span>Corporation No.</span>
              </div>
              <p className="text-sm font-semibold text-white font-mono">
                1720493-1
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-eco-muted text-xs uppercase tracking-wider font-mono">
                <Calendar size={14} className="text-eco-blue" />
                <span>Incorporated</span>
              </div>
              <p className="text-sm font-semibold text-white">
                July 31, 2025
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-eco-muted text-xs uppercase tracking-wider font-mono">
                <Globe size={14} className="text-eco-blue" />
                <span>Official Website</span>
              </div>
              <p className="text-sm font-semibold text-eco-blue font-mono">
                ecohoops.ca
              </p>
            </div>
          </div>
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
              <div className="w-12 h-12 rounded-2xl bg-eco-blue/10 flex items-center justify-center">
                <Brain className="text-eco-blue" size={24} />
              </div>
              <h2 className="font-heading font-bold text-2xl text-white uppercase">Mental Health Focus</h2>
            </div>
            <p className="text-eco-muted-light mb-8 leading-relaxed">
              Youth sports have become too stressful. Kids get too tired and anxious. We help kids stay happy by talking about feelings and mental health on the court.
            </p>

            <div className="glow-card p-8 border-l-4 border-eco-blue relative overflow-hidden mb-10">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={80} className="text-eco-blue" />
              </div>
              
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-eco-blue mb-6 flex items-center gap-2">
                The Foundation: UN Convention Article 31
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <span className="text-eco-blue font-heading font-bold text-2xl opacity-50">01</span>
                  <div>
                    <p className="text-sm text-white/90 leading-relaxed italic mb-1">
                      "States Parties recognize the right of the child to rest and leisure, to engage in play and recreational activities appropriate to the age of the child and to participate freely in cultural life and the arts."
                    </p>
                    <p className="text-xs text-eco-muted-light">
                      <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">This means:</strong> Every child has the right to rest, play, and have fun.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <span className="text-eco-blue font-heading font-bold text-2xl opacity-50">02</span>
                  <div>
                    <p className="text-sm text-white/90 leading-relaxed italic mb-1">
                      "States Parties shall respect and promote the right of the child to participate fully in cultural and artistic life and shall encourage the provision of appropriate and equal opportunities for cultural, artistic, recreational and leisure activity."
                    </p>
                    <p className="text-xs text-eco-muted-light">
                      <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">This means:</strong> Governments must make sure all kids get a fair chance to play and do activities.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-eco-muted uppercase tracking-widest">United Nations Convention on the Rights of the Child</span>
                <a 
                  href="https://www.unicef.org/child-rights-convention/convention-text" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-eco-blue hover:text-white underline underline-offset-4 transition-colors font-bold uppercase tracking-widest"
                >
                  View Full Document
                </a>
              </div>
            </div>
            <div className="mt-8 mb-4">
              <span className="bg-eco-blue/10 border border-eco-blue/20 text-eco-blue text-[10px] font-mono uppercase px-2.5 py-1 rounded inline-block mb-3">
                Future Initiatives (Building & Growing)
              </span>
              <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-white mb-4">
                What We Are Building Toward:
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Monthly classes about feelings and wellness for all kids',
                'Coaches trained to help kids when they are stressed',
                'Support from experts who understand the athlete\'s mind',
                'We focus on making kids feel safe to make mistakes'
              ].map((item, i) => (
                <li key={i} className="flex flex-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Sparkles size={16} className="text-eco-blue/60" />
                  </div>
                  <span className="text-white/75">{item}</span>
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
              <h3 className="text-xl md:text-2xl font-heading font-bold text-white uppercase mb-6 flex items-center justify-center gap-3">
                <Zap className="text-eco-blue" size={24} />
                The Play State
              </h3>
              <div className="text-eco-muted-light leading-relaxed max-w-4xl mx-auto text-base md:text-lg space-y-4 pt-2">
                <p>
                  Science shows that play is a{" "}
                  <span className="text-eco-blue font-bold px-2 py-0.5 rounded bg-eco-blue/10 border border-eco-blue/20">
                    biological necessity
                  </span>{" "}
                  <span className="text-xs text-eco-muted italic block sm:inline mt-1 sm:mt-0">
                    (something the body must have to stay alive and healthy)
                  </span>.
                </p>
                <p>
                  When a child is playing,{" "}
                  <span className="text-eco-blue font-bold px-2 py-0.5 rounded bg-eco-blue/10 border border-eco-blue/20">
                    neurons
                  </span>{" "}
                  <span className="text-xs text-eco-muted italic block sm:inline mt-1 sm:mt-0">
                    (brain cells)
                  </span>{" "}
                  light up, building new{" "}
                  <span className="text-eco-blue font-bold px-2 py-0.5 rounded bg-eco-blue/10 border border-eco-blue/20">
                    neural pathways
                  </span>{" "}
                  <span className="text-xs text-eco-muted italic block sm:inline mt-1 sm:mt-0">
                    (connections in the brain)
                  </span>.
                </p>
                <p>
                  These connections help kids move well, make friends, and learn{" "}
                  <span className="text-eco-blue font-bold px-2 py-0.5 rounded bg-eco-blue/10 border border-eco-blue/20">
                    emotional regulation
                  </span>{" "}
                  <span className="text-xs text-eco-muted italic block sm:inline mt-1 sm:mt-0">
                    (controlling their feelings)
                  </span>.
                </p>
              </div>
            </div>
            {[
              { title: 'Self-Directed', desc: 'Kids choose the game themselves. This helps them focus and enjoy it more.' },
              {
                title: 'Intrinsically Motivated',
                desc: (
                  <span>
                    Kids are <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">intrinsically motivated</strong> <span className="text-xs text-eco-muted italic">(doing something because you love it, not for a trophy or because you are scared)</span>.
                  </span>
                )
              },
              { title: 'Structured', desc: 'Play has rules in the child\'s mind. This helps them learn order and self-control.' },
              { title: 'Imaginative', desc: 'Play is creative. Kids can try new things without being afraid of failing.' },
              { title: 'Active Engagement', desc: 'Kids are completely focused. They forget about time and build deep focus.' }
            ].map((element, i) => (
              <div key={i} className={`bg-eco-surface2 p-8 rounded-3xl border border-eco-border hover:border-eco-blue/50 transition-colors ${i === 3 || i === 4 ? 'md:col-span-1.5' : ''}`}>
                <div className="text-eco-blue font-heading font-bold text-lg mb-3 flex items-center gap-3">
                  <span className="opacity-30 text-2xl">{i + 1}</span>
                  {element.title}
                </div>
                <div className="text-sm text-eco-muted-light leading-relaxed">{element.desc}</div>
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
                Our basketball games are built as <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">Free Play</strong>. This builds connections in the <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">cortex</strong> <span className="text-xs text-eco-muted italic">(the outer part of the brain used for thinking)</span>. The more kids play, the more they build lifetime skills: <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">resilience</strong> <span className="text-xs text-eco-muted italic">(recovering from hard times)</span>, creativity, and <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">equanimity</strong> <span className="text-xs text-eco-muted italic">(staying calm under pressure)</span>.
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
              <h2 className="font-heading font-bold text-2xl text-white uppercase">Our Legal Foundation</h2>
            </div>
            <p className="text-eco-muted-light mb-6 leading-relaxed">
              EcoHoops for Kids Canada and EcoHoops Inc. are separate legal entities that share the EcoHoops brand and website. They are not the same corporation.
            </p>
            <p className="text-xs text-eco-muted mb-8 leading-relaxed">
              Ecohoops.ca serves as the official website and web presence for EcoHoops for Kids Canada and its nonprofit youth programs.
            </p>

             <div className="space-y-4">
               {/* For-profit card */}
               <div className="bg-eco-surface2 p-6 rounded-2xl border border-eco-border relative overflow-hidden group hover:border-eco-blue/30 transition-colors">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-heading font-bold text-white text-base">EcoHoops Inc.</h3>
                   <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-eco-blue/10 border border-eco-blue/30 text-eco-blue-light font-bold">
                     For-Profit Corporation
                   </span>
                 </div>
                 <p className="text-[10px] text-eco-muted mb-3 font-mono">INCORPORATED: SEP 11, 2024</p>
                 <p className="text-xs text-eco-muted-light leading-relaxed">
                   Handles the basketball side of the program. This includes coaching, skill development, practice design, team structure, program planning, and basketball activities.
                 </p>
               </div>

               {/* Non-profit card */}
               <div className="bg-eco-surface2 p-6 rounded-2xl border border-eco-blue/40 relative overflow-hidden group hover:border-eco-blue/60 transition-colors">
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                   <div>
                     <h3 className="font-heading font-bold text-white text-base">EcoHoops for Kids Canada</h3>
                     <span className="text-[11px] text-eco-muted font-body">EcoHoops pour Enfants Canada</span>
                   </div>
                   <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-eco-blue/15 border border-eco-blue/40 text-eco-blue font-bold self-start">
                     Federal Non-Profit Corporation
                   </span>
                 </div>
                 <p className="text-[10px] text-eco-muted mb-1 font-mono">FEDERAL CORPORATION NO: 1720493-1</p>
                 <p className="text-[10px] text-eco-muted mb-3 font-mono">INCORPORATED: JUL 31, 2025 &bull; OFFICIAL WEBSITE: ECOHOOPS.CA</p>
                 <p className="text-xs text-eco-muted-light leading-relaxed">
                   Helps make basketball accessible for youth and families. This includes gym rentals, equipment support, financial aid coordination, free community sessions, girls' sports initiatives, and wellness education. Ecohoops.ca serves as its official website and web presence.
                 </p>
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
