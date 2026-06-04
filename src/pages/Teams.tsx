import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TEAMS } from '../data/teams'
import { useScrollReveal, useMouseGlow } from '../hooks/useScrollReveal'
import { Users, Trophy, Calendar, MapPin, X, TrendingUp } from 'lucide-react'
import type { Player, Team } from '../types'

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0] || null)
  const { ref, isVisible } = useScrollReveal(0.05)
  const navigate = useNavigate()

  if (TEAMS.length === 0) {
    return (
      <section className="pt-28 pb-20 min-h-screen flex flex-col items-center justify-center">
        <h1 className="font-display text-4xl text-white mb-4 uppercase">Rosters</h1>
        <p className="text-eco-muted-light text-lg">Rosters for the upcoming season are currently being finalized.</p>
      </section>
    )
  }

  return (
    <section ref={ref} className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <span className="tag mb-4 inline-block">Roster</span>
          <h1 className="font-display text-section uppercase mb-4">
            <span className="text-white">OUR </span>
            <span className="gradient-text">SQUADS</span>
          </h1>
          <p className="text-eco-muted-light text-lg max-w-xl">
            Meet the players building the future of basketball in the GTA.
          </p>
        </motion.div>

        {/* Team Selector */}
        <div className="space-y-8 mb-12">
          {/* Active Teams */}
          <div>
            <h3 className="text-sm font-heading font-bold text-eco-muted-light uppercase tracking-widest mb-4">Current Rosters</h3>
            {TEAMS.filter(t => t.isActive).length === 0 ? (
              <p className="text-eco-muted-light text-sm italic">Spring/Summer 2026 rosters are currently being finalized.</p>
            ) : (
              <div className="flex gap-4 flex-wrap">
                {TEAMS.filter(t => t.isActive).map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className={`px-6 py-3 rounded-xl font-heading font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                      selectedTeam?.id === team.id
                        ? 'bg-eco-orange text-white shadow-glow-sm'
                        : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-orange/30'
                    }`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Past Seasons */}
          {TEAMS.some(t => !t.isActive) && (
            <div>
              <h3 className="text-sm font-heading font-bold text-eco-muted-light uppercase tracking-widest mb-4">Past Seasons</h3>
              <div className="flex gap-4 flex-wrap">
                {TEAMS.filter(t => !t.isActive).map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className={`px-6 py-3 rounded-xl font-heading font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                      selectedTeam?.id === team.id
                        ? 'bg-eco-orange text-white shadow-glow-sm'
                        : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-orange/30'
                    }`}
                  >
                    {team.name} - {team.season}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Team Overview Card with Photo */}
        <motion.div
          key={selectedTeam.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glow-card overflow-hidden mb-16"
        >
          {/* Team Photo */}
          {selectedTeam.teamPhoto ? (
            <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-t-2xl">
              <img
                src={selectedTeam.teamPhoto}
                alt={`${selectedTeam.name} team photo`}
                className="w-full h-full object-cover object-[center_30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-eco-surface via-eco-surface/40 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <div className="flex gap-2 items-center mb-2">
                  <span className="bg-eco-orange text-white text-[10px] sm:text-xs px-2 py-1 rounded-md font-heading uppercase tracking-wider">
                    {selectedTeam.season}
                  </span>
                  <span className="bg-eco-surface border border-eco-border text-white text-[10px] sm:text-xs px-2 py-1 rounded-md font-heading uppercase tracking-wider">
                    {selectedTeam.gender}
                  </span>
                  {!selectedTeam.isActive && (
                    <span className="bg-eco-muted text-eco-surface border border-eco-border text-[10px] sm:text-xs px-2 py-1 rounded-md font-heading uppercase tracking-wider">
                      Archived
                    </span>
                  )}
                </div>
                <h2 className="font-display text-3xl md:text-4xl uppercase text-white drop-shadow-lg">
                  {selectedTeam.name}
                </h2>
              </div>
            </div>
          ) : (
            <div className="p-8 pb-0">
              <div className="flex gap-2 items-center mb-2">
                <span className="bg-eco-orange text-white text-[10px] sm:text-xs px-2 py-1 rounded-md font-heading uppercase tracking-wider">
                  {selectedTeam.season}
                </span>
                <span className="bg-eco-surface border border-eco-border text-white text-[10px] sm:text-xs px-2 py-1 rounded-md font-heading uppercase tracking-wider">
                  {selectedTeam.gender}
                </span>
                {!selectedTeam.isActive && (
                  <span className="bg-eco-muted text-eco-surface border border-eco-border text-[10px] sm:text-xs px-2 py-1 rounded-md font-heading uppercase tracking-wider">
                    Archived
                  </span>
                )}
              </div>
              <h2 className="font-display text-3xl md:text-4xl uppercase text-white drop-shadow-lg">
                {selectedTeam.name}
              </h2>
            </div>
          )}

          {/* Stats row */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-eco-orange/10 flex items-center justify-center">
                <Users size={18} className="text-eco-orange" />
              </div>
              <div>
                <p className="text-xs text-eco-muted uppercase tracking-wider">Players</p>
                <p className="font-heading font-bold text-white">{selectedTeam.roster.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center">
                <Trophy size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-eco-muted uppercase tracking-wider">Record</p>
                <p className="font-heading font-bold text-white">{selectedTeam.record}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center">
                <Calendar size={18} className="text-eco-blue" />
              </div>
              <div>
                <p className="text-xs text-eco-muted uppercase tracking-wider">Season</p>
                <p className="font-heading font-bold text-white">{selectedTeam.season}</p>
              </div>
            </div>
            {selectedTeam.nextGame && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-eco-blue-light/10 flex items-center justify-center">
                  <MapPin size={18} className="text-eco-blue-light" />
                </div>
                <div>
                  <p className="text-xs text-eco-muted uppercase tracking-wider">Next Game</p>
                  <p className="font-heading font-bold text-white text-sm">{selectedTeam.nextGame.date}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Polaroid Roster Grid (Larger Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 lg:gap-16 pb-20 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {selectedTeam.roster.map((player, i) => (
              <PlayerCard
                key={player.id}
                player={player}
                index={i}
                onClick={() => navigate(`/player/${selectedTeam.id}/${player.id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function PlayerCard({
  player,
  index,
  onClick,
}: {
  player: Player
  index: number
  onClick: () => void
}) {
  // Alternate rotation for a scattered polaroid effect
  const isEven = index % 2 === 0
  const baseRotation = isEven ? 'rotate-2' : '-rotate-2'
  const hoverRotation = isEven ? 'hover:-rotate-1' : 'hover:rotate-1'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={onClick}
      className={`relative h-fit bg-white p-3 pb-4 shadow-xl cursor-pointer transition-all duration-300 transform ${baseRotation} ${hoverRotation} hover:scale-105 hover:z-20 hover:shadow-2xl`}
    >
      {/* Tape Effect */}
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 backdrop-blur-sm -rotate-2 z-10 shadow-sm" />

      {/* Image Container */}
      <div className="relative aspect-square mb-2 bg-gray-100 overflow-hidden">
        {player.avatar ? (
          <img
            src={player.avatar}
            alt={player.name}
            className="w-full h-full object-cover filter contrast-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-4xl text-gray-300">
            #{player.number}
          </div>
        )}
        
        {/* Number Overlay */}
        <div className="absolute top-2 right-3 font-display text-5xl text-white/40 drop-shadow-md select-none">
          {player.number}
        </div>
      </div>

      {/* Graffiti Info */}
      <div className="text-center">
        <p className="font-graffiti text-eco-black text-xl md:text-2xl tracking-wide -rotate-2 transform">
          {player.name}
        </p>
        <p className="text-gray-500 font-heading text-[10px] md:text-xs uppercase tracking-widest mt-1">
          {player.position} &middot; {player.height}
        </p>
      </div>
    </motion.div>
  )
}



