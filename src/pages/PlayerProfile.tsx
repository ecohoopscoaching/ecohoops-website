import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Film, User } from 'lucide-react'
import { TEAMS } from '../data/teams'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function PlayerProfile() {
  const { teamId, playerId } = useParams()
  const navigate = useNavigate()
  const { ref, isVisible } = useScrollReveal(0.05)

  const team = TEAMS.find(t => t.id === teamId)
  const player = team?.roster.find(p => p.id === playerId)

  if (!team || !player) {
    return <Navigate to="/teams" replace />
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-eco-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/teams')}
          className="flex items-center gap-2 text-eco-muted hover:text-white transition-colors mb-8 uppercase font-heading text-sm tracking-widest"
        >
          <ArrowLeft size={16} />
          Back to Roster
        </button>

        {/* Hero Section */}
        <section ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24 items-center">
          {/* Polaroid Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50, rotate: -5 }}
            animate={isVisible ? { opacity: 1, x: 0, rotate: -2 } : {}}
            transition={{ duration: 0.7, type: 'spring' }}
            className="relative bg-white p-4 pb-12 shadow-2xl mx-auto max-w-md w-full"
          >
            <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-32 h-8 bg-white/70 backdrop-blur-md -rotate-3 z-10 shadow-sm" />
            
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative border border-gray-200">
              {player.avatar ? (
                <img 
                  src={player.avatar} 
                  alt={player.name}
                  className="w-full h-full object-cover filter contrast-110 saturate-50"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-8xl text-gray-300">
                  #{player.number}
                </div>
              )}
              {/* Number Overlay */}
              <div className="absolute top-4 right-4 text-8xl font-display text-white/40 drop-shadow-lg pointer-events-none select-none">
                {player.number}
              </div>
            </div>
            
            <div className="absolute bottom-4 left-0 w-full text-center">
              <span className="font-graffiti text-eco-black text-3xl tracking-wider">
                {team.name}
              </span>
            </div>
          </motion.div>

          {/* Player Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="mb-6 flex items-center gap-4 flex-wrap">
              <span className="bg-eco-orange text-white text-xs px-3 py-1 rounded-md font-heading uppercase tracking-widest">
                {team.season}
              </span>
              <span className="border border-eco-border text-eco-blue text-xs px-3 py-1 rounded-md font-heading uppercase tracking-widest">
                {player.position}
              </span>
              <span className="border border-eco-border text-eco-muted-light text-xs px-3 py-1 rounded-md font-heading uppercase tracking-widest">
                {player.height}
              </span>
            </div>

            <h1 className="font-display text-[clamp(4rem,8vw,8rem)] leading-none text-white uppercase mb-2 drop-shadow-md">
              {player.name.split(' ')[0]} <br/>
              <span className="gradient-text">{player.name.split(' ').slice(1).join(' ')}</span>
            </h1>

            <div className="h-1 w-24 bg-gradient-to-r from-eco-orange to-eco-blue mb-8 mt-6"></div>

            <h3 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-eco-orange" />
              PLAYER BIO
            </h3>
            <p className="text-eco-muted-light leading-relaxed text-lg mb-8 max-w-xl">
              An integral part of the {team.name} squad. Known for exceptional court vision, relentless defense, and the ability to make clutch plays down the stretch. Bringing energy and leadership to every game this season.
            </p>

            {/* Core Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl">
              {[
                { label: 'PPG', value: player.stats.ppg },
                { label: 'RPG', value: player.stats.rpg },
                { label: 'APG', value: player.stats.apg },
                { label: 'SPG', value: player.stats.spg },
              ].map((stat) => (
                <div key={stat.label} className="bg-eco-surface border border-eco-border p-4 text-center rounded-xl relative overflow-hidden group hover:border-eco-orange/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-eco-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="font-display text-3xl text-white relative z-10">{stat.value}</p>
                  <p className="font-mono text-xs text-eco-muted uppercase tracking-wider relative z-10">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Film Room Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="border-t border-eco-border/50 pt-20"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl bg-eco-blue/10 flex items-center justify-center">
              <Film size={24} className="text-eco-blue" />
            </div>
            <div>
              <h2 className="font-display text-4xl uppercase text-white">The Film Room</h2>
              <p className="text-eco-muted font-heading uppercase tracking-widest text-sm">Season Highlights & Breakdown</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video Player Placeholder */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video bg-eco-surface2 rounded-2xl border border-eco-border overflow-hidden group cursor-pointer shadow-2xl">
                <div className="absolute inset-0 bg-eco-black/40 group-hover:bg-eco-black/20 transition-colors z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-20 h-20 rounded-full bg-eco-orange/90 flex items-center justify-center pl-2 group-hover:scale-110 transition-transform shadow-glow-sm">
                    <Play size={32} className="text-white" />
                  </div>
                </div>
                {/* Simulated Thumbnail */}
                <div className="absolute inset-0 bg-[url('/images/u15\ boys\ team\ pic.jpg')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
                
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="bg-black/60 backdrop-blur-md text-white font-mono text-sm px-3 py-1 rounded-md mb-2 inline-block">
                    03:45
                  </span>
                  <h3 className="font-heading font-bold text-2xl text-white">Mid-Season Mixtape</h3>
                  <p className="text-eco-muted-light text-sm">Top plays from the Winter campaign.</p>
                </div>
              </div>
            </div>

            {/* Sidebar Gallery Placeholders */}
            <div className="grid grid-rows-2 gap-8">
              {[1, 2].map((idx) => (
                <div key={idx} className={`relative bg-white p-2 pb-8 shadow-xl transform ${idx === 1 ? 'rotate-2' : '-rotate-1'} hover:rotate-0 transition-transform cursor-pointer`}>
                  <div className="aspect-[4/3] bg-eco-surface overflow-hidden">
                    <div className="w-full h-full bg-[url('/images/12.png')] bg-cover bg-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="absolute bottom-2 left-0 w-full text-center">
                    <span className="font-graffiti text-eco-muted text-sm">Game {idx * 4} Photo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  )
}
