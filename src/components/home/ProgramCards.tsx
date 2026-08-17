import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Trophy, Sparkles, Flame, HeartHandshake } from 'lucide-react'
import { useScrollReveal, useMouseGlow } from '../../hooks/useScrollReveal'

const PROGRAMS = [
  {
    title: 'Rep Teams',
    description: 'Competitive youth basketball squads playing in GTA leagues, focusing on team chemistry, tactical decision-making, and elite growth.',
    target: 'Boys & Girls aged 10-15 ready for league play.',
    path: '/rep',
    icon: Trophy,
    color: '#97B3D2',
    cta: 'View Divisions'
  },
  {
    title: 'EcoHoops Jr. (Jr. NBA/WNBA)',
    description: 'Jr. NBA & Jr. WNBA programming and fun, play-based training designed to introduce fundamentals, build coordination, and spark a lifelong love for the game.',
    target: 'Beginner & intermediate players aged 5-11.',
    path: '/jr',
    icon: Sparkles,
    color: '#6A9BC7',
    cta: 'Explore EcoHoops Jr.'
  },
  {
    title: 'All-Girls Basketball',
    description: 'Dedicated, empowering training environments led by positive role models to foster confidence, teamwork, and athletic skills.',
    target: 'Girls aged 8-16 of all skill levels.',
    path: '/girls',
    icon: Flame,
    color: '#B0C8E0',
    cta: 'Explore Girls Program'
  },
  {
    title: 'EcoHoops for Kids Canada',
    description: 'Our registered nonprofit arm dedicated to ensuring access, offering financial subsidies, and driving community wellness programs.',
    target: 'Families seeking financial aid & community programs.',
    path: '/nonprofit',
    icon: HeartHandshake,
    color: '#4A7FB5',
    cta: 'Learn About Our Mission'
  }
]

export default function ProgramCards() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} id="programs" className="relative py-24 overflow-hidden bg-eco-black">
      {/* Subtle background team image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/hero-bg-new-1.jpg" 
          alt="EcoHoops Rep Team action play" 
          className="w-full h-full object-cover opacity-[0.03] mix-blend-luminosity filter contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-eco-black via-transparent to-eco-black" />
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-eco-navy/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Youth Basketball Programs</span>
          <h2 className="font-display text-4xl md:text-6xl uppercase text-white">
            OUR <span className="gradient-text">PROGRAMS</span>
          </h2>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto mt-4">
            Mississauga basketball training built around skill, confidence, and belonging. Find the right program for your child.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PROGRAMS.map((prog, i) => (
            <Card key={prog.title} prog={prog} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Card({ prog, index, isVisible }: { prog: typeof PROGRAMS[number]; index: number; isVisible: boolean }) {
  const glowRef = useMouseGlow()

  return (
    <motion.div
      ref={glowRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className="glow-card group flex flex-col justify-between p-8 md:p-10 h-full overflow-hidden relative transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, #0b1120, #0f182c)',
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors duration-300"
            style={{ 
              backgroundColor: `${prog.color}10`, 
              borderColor: `${prog.color}25` 
            }}
          >
            <prog.icon size={22} style={{ color: prog.color }} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-eco-muted">0{index + 1}</span>
        </div>

        <h3 className="font-display text-2xl uppercase text-white mb-4 group-hover:text-eco-blue-light transition-colors">
          {prog.title}
        </h3>
        
        <p className="text-sm text-eco-muted-light leading-relaxed mb-6">
          {prog.description}
        </p>

        <div className="border-t border-white/5 pt-4 mb-6">
          <p className="text-[10px] font-mono uppercase tracking-wider text-eco-muted mb-1">Who it's for</p>
          <p className="text-xs text-white font-medium">{prog.target}</p>
        </div>
      </div>

      <Link
        to={prog.path}
        className="btn-ghost !py-3.5 !px-6 text-xs w-full flex items-center justify-center gap-2 group-hover:border-eco-blue/40 group-hover:shadow-[0_0_20px_rgba(151,179,210,0.1)]"
      >
        {prog.cta}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  )
}
