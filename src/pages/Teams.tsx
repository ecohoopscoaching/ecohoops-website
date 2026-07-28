import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Users, Trophy, Calendar, MapPin, X, BarChart2, ArrowUpDown, Check } from 'lucide-react'
import type { Player, Team } from '../types'
import { useData } from '../contexts/DataContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Teams() {
  useDocumentTitle('Active Roster & Stats')
  const { teams } = useData()
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '')
  const selectedTeam = useMemo(() => teams.find(t => t.id === selectedTeamId) || teams[0], [teams, selectedTeamId])
  const [positionFilter, setPositionFilter] = useState<'All' | 'Guards' | 'Forwards' | 'Centers'>('All')
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'ppg' | 'rpg' | 'apg'>('number')
  const [comparePlayers, setComparePlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  
  const { ref, isVisible } = useScrollReveal(0.05)
  const navigate = useNavigate()

  // Calculate leaders for selected team
  const leaders = useMemo(() => {
    if (!selectedTeam || selectedTeam.roster.length === 0) return null
    const roster = selectedTeam.roster
    const ppgL = [...roster].sort((a, b) => b.stats.ppg - a.stats.ppg)[0]
    const rpgL = [...roster].sort((a, b) => b.stats.rpg - a.stats.rpg)[0]
    const apgL = [...roster].sort((a, b) => b.stats.apg - a.stats.apg)[0]
    const spgL = [...roster].sort((a, b) => b.stats.spg - a.stats.spg)[0]

    return [
      { label: 'Scoring Leader', name: ppgL.name, val: `${ppgL.stats.ppg} PPG`, avatar: ppgL.avatar, number: ppgL.number, id: ppgL.id },
      { label: 'Rebounding Leader', name: rpgL.name, val: `${rpgL.stats.rpg} RPG`, avatar: rpgL.avatar, number: rpgL.number, id: rpgL.id },
      { label: 'Assists Leader', name: apgL.name, val: `${apgL.stats.apg} APG`, avatar: apgL.avatar, number: apgL.number, id: apgL.id },
      { label: 'Steals Leader', name: spgL.name, val: `${spgL.stats.spg} SPG`, avatar: spgL.avatar, number: spgL.number, id: spgL.id },
    ]
  }, [selectedTeam])

  // Filter & sort player list
  const filteredAndSortedRoster = useMemo(() => {
    if (!selectedTeam) return []
    let roster = [...selectedTeam.roster]

    // Position Filter
    if (positionFilter !== 'All') {
      roster = roster.filter((player) => {
        const pos = player.position.toUpperCase()
        if (positionFilter === 'Guards') return pos.includes('G') || pos.includes('PG') || pos.includes('SG')
        if (positionFilter === 'Forwards') return pos.includes('F') || pos.includes('SF') || pos.includes('PF')
        if (positionFilter === 'Centers') return pos === 'C'
        return true
      })
    }

    // Sort
    roster.sort((a, b) => {
      if (sortBy === 'number') return a.number - b.number
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'ppg') return b.stats.ppg - a.stats.ppg
      if (sortBy === 'rpg') return b.stats.rpg - a.stats.rpg
      if (sortBy === 'apg') return b.stats.apg - a.stats.apg
      return 0
    })

    return roster
  }, [selectedTeam, positionFilter, sortBy])

  // Toggle compare player
  const handleToggleCompare = (player: Player, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigating to profile when clicking Compare
    setComparePlayers((prev) => {
      const isSelected = prev.some((p) => p.id === player.id)
      if (isSelected) {
        return prev.filter((p) => p.id !== player.id)
      }
      if (prev.length >= 2) {
        // Swap out the first one if already at capacity
        return [prev[1], player]
      }
      return [...prev, player]
    })
  }

  const handleClearCompare = () => {
    setComparePlayers([])
  }

  if (teams.length === 0) {
    return (
      <section className="pt-28 pb-20 min-h-screen flex flex-col items-center justify-center">
        <h1 className="font-display text-4xl text-white mb-4 uppercase">Rosters</h1>
        <p className="text-eco-muted-light text-lg">Rosters for the upcoming season are currently being finalized.</p>
      </section>
    )
  }

  return (
    <section ref={ref} className="pt-28 pb-20 min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-eco-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-eco-navy/10 blur-[150px] pointer-events-none" />

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
            Meet the players building the future of basketball in Mississauga.
          </p>
        </motion.div>

        {/* Team Selector */}
        <div className="space-y-8 mb-12">
          {/* Active Teams */}
          <div>
            <h3 className="text-sm font-heading font-bold text-eco-muted-light uppercase tracking-widest mb-4">Current Rosters</h3>
            {teams.filter(t => t.isActive).length === 0 ? (
              <p className="text-eco-muted-light text-sm italic">Spring/Summer 2026 rosters are currently being finalized.</p>
            ) : (
              <div className="flex gap-4 flex-wrap">
                {teams.filter(t => t.isActive).map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      setSelectedTeamId(team.id)
                      setPositionFilter('All')
                      setComparePlayers([])
                    }}
                    className={`px-6 py-3 rounded-xl font-heading font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                      selectedTeam?.id === team.id
                        ? 'bg-eco-blue text-eco-black shadow-glow-sm font-bold'
                        : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-blue/30'
                    }`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Past Seasons */}
          {teams.some(t => !t.isActive) && (
            <div>
              <h3 className="text-sm font-heading font-bold text-eco-muted-light uppercase tracking-widest mb-4">Past Seasons</h3>
              <div className="flex gap-4 flex-wrap">
                {teams.filter(t => !t.isActive).map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      setSelectedTeamId(team.id)
                      setPositionFilter('All')
                      setComparePlayers([])
                    }}
                    className={`px-6 py-3 rounded-xl font-heading font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                      selectedTeam?.id === team.id
                        ? 'bg-eco-blue text-eco-black shadow-glow-sm font-bold'
                        : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-blue/30'
                    }`}
                  >
                    {team.name} - {team.season}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Team Layout Section */}
        <div className="mb-16">
          {/* Main Team Overview Card */}
          <motion.div
            key={`overview-${selectedTeam.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glow-card overflow-hidden w-full"
          >
            {/* Team Photo */}
            {selectedTeam.teamPhoto ? (
              <div className="relative h-[240px] sm:h-[300px] overflow-hidden rounded-t-2xl">
                <img
                  src={selectedTeam.teamPhoto}
                  alt={`${selectedTeam.name} team photo`}
                  className="w-full h-full object-cover object-[center_30%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-eco-surface via-eco-surface/40 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <div className="flex gap-2 items-center mb-2">
                    <span className="bg-eco-blue text-eco-black text-[10px] sm:text-xs px-2 py-1 rounded-md font-heading font-bold uppercase tracking-wider">
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
                  <span className="bg-eco-blue text-eco-black text-[10px] sm:text-xs px-2 py-1 rounded-md font-heading font-bold uppercase tracking-wider">
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
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-eco-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center">
                  <Users size={18} className="text-eco-blue" />
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
                  <p className="font-heading font-bold text-white text-xs sm:text-sm truncate max-w-[100px]">{selectedTeam.season.split(' ')[0]}</p>
                </div>
              </div>
              {selectedTeam.nextGame && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-eco-blue-light/10 flex items-center justify-center">
                    <MapPin size={18} className="text-eco-blue-light" />
                  </div>
                  <div>
                    <p className="text-xs text-eco-muted uppercase tracking-wider">Next Game</p>
                    <p className="font-heading font-bold text-white text-xs sm:text-sm">{selectedTeam.nextGame.date}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Filter and Sorting Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-eco-surface border border-eco-border p-4 rounded-2xl mb-12">
          {/* Position Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {(['All', 'Guards', 'Forwards', 'Centers'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setPositionFilter(pos)}
                className={`px-4 py-2 rounded-xl font-heading text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                  positionFilter === pos
                    ? 'bg-eco-blue/20 text-eco-blue border border-eco-blue/30 shadow-glow-sm'
                    : 'bg-transparent text-eco-muted-light hover:text-white border border-transparent'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-eco-muted uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown size={14} /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-eco-surface2 border border-eco-border text-white text-xs rounded-xl px-3 py-2 font-heading focus:outline-none focus:border-eco-blue/50 transition-colors cursor-pointer"
            >
              <option value="number">Jersey #</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Roster Grid with dynamic transitions */}
        {filteredAndSortedRoster.length === 0 ? (
          <div className="text-center py-20 bg-eco-surface rounded-2xl border border-eco-border">
            <p className="text-eco-muted-light text-lg">No players match the selected filters.</p>
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 lg:gap-16 pb-20 max-w-5xl mx-auto"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedRoster.map((player, i) => {
                const isSelectedForCompare = comparePlayers.some((p) => p.id === player.id)
                return (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    index={i}
                    isSelectedForCompare={isSelectedForCompare}
                    onToggleCompare={(e) => handleToggleCompare(player, e)}
                    onClick={() => setSelectedPlayer(player)}
                  />
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Scout's Compare Drawer */}
      <AnimatePresence>
        {comparePlayers.length > 0 && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full bg-eco-surface/90 backdrop-blur-xl border-t border-eco-blue/20 shadow-[0_-15px_40px_rgba(0,0,0,0.5)] z-50 py-6 px-6 sm:px-10"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4 border-b border-eco-border/40 pb-2">
                <div>
                  <h4 className="font-display text-xl uppercase tracking-wider text-white">Scout's Compare Tool</h4>
                  <p className="text-xs text-eco-muted uppercase tracking-widest">
                    {comparePlayers.length === 1 
                      ? 'Select 1 more player to see head-to-head stats comparison'
                      : 'Head-to-Head Player Analysis'}
                  </p>
                </div>
                <button 
                  onClick={handleClearCompare}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-eco-muted hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {comparePlayers.length === 1 ? (
                <div className="flex items-center gap-4 py-4">
                  <div className="flex items-center gap-3 bg-eco-surface2/50 border border-white/5 p-3 rounded-xl">
                    {comparePlayers[0].avatar ? (
                      <img src={comparePlayers[0].avatar} alt={comparePlayers[0].name} className="w-12 h-12 rounded-lg object-cover contrast-110 saturate-50" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center font-display text-white text-lg">
                        #{comparePlayers[0].number}
                      </div>
                    )}
                    <div>
                      <p className="font-heading font-semibold text-white leading-tight">{comparePlayers[0].name}</p>
                      <p className="text-[10px] text-eco-muted uppercase tracking-widest">{comparePlayers[0].position} &middot; {comparePlayers[0].height}</p>
                    </div>
                  </div>
                  <span className="text-sm text-eco-muted-light font-heading italic">Select another player card's "Compare" tag to run analytics...</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 py-4 items-center">
                  {/* Player 1 Card Details */}
                  <div className="flex flex-col items-center text-center gap-2 bg-eco-surface2/30 border border-white/5 p-3 rounded-xl">
                    {comparePlayers[0].avatar ? (
                      <img src={comparePlayers[0].avatar} alt={comparePlayers[0].name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/10 contrast-110 saturate-50" />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center font-display text-white text-2xl">
                        #{comparePlayers[0].number}
                      </div>
                    )}
                    <div>
                      <p className="font-heading font-bold text-white text-xs sm:text-sm leading-tight truncate max-w-[120px]">{comparePlayers[0].name}</p>
                      <p className="text-[10px] text-eco-muted uppercase tracking-widest">{comparePlayers[0].position} | {comparePlayers[0].height}</p>
                    </div>
                  </div>

                  {/* Comparisons Column */}
                  <div className="space-y-3">
                    {[
                      { label: 'PPG', val1: comparePlayers[0].stats.ppg, val2: comparePlayers[1].stats.ppg },
                      { label: 'RPG', val1: comparePlayers[0].stats.rpg, val2: comparePlayers[1].stats.rpg },
                      { label: 'APG', val1: comparePlayers[0].stats.apg, val2: comparePlayers[1].stats.apg },
                      { label: 'SPG', val1: comparePlayers[0].stats.spg, val2: comparePlayers[1].stats.spg },
                      { label: 'FG%', val1: comparePlayers[0].stats.fgPct, val2: comparePlayers[1].stats.fgPct },
                    ].map((stat) => {
                      const is1Winner = stat.val1 > stat.val2
                      const is2Winner = stat.val2 > stat.val1
                      return (
                        <div key={stat.label} className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-eco-muted tracking-wider px-1">
                            <span className={is1Winner ? 'text-eco-blue font-extrabold' : ''}>{stat.val1}</span>
                            <span>{stat.label}</span>
                            <span className={is2Winner ? 'text-eco-blue font-extrabold' : ''}>{stat.val2}</span>
                          </div>
                          {/* Progress bar stack */}
                          <div className="h-1.5 w-full flex bg-white/5 rounded-full overflow-hidden">
                            {/* Left player bar (fills right to left) */}
                            <div className="w-1/2 flex justify-end bg-black/20">
                              <div 
                                className={`h-full rounded-l-full transition-all duration-500 ${is1Winner ? 'bg-eco-blue shadow-glow-sm' : 'bg-eco-muted/50'}`}
                                style={{ width: `${Math.min(100, (stat.val1 / (stat.val1 + stat.val2 || 1)) * 100)}%` }}
                              />
                            </div>
                            {/* Divider */}
                            <div className="w-[2px] bg-white/20" />
                            {/* Right player bar (fills left to right) */}
                            <div className="w-1/2 bg-black/20">
                              <div 
                                className={`h-full rounded-r-full transition-all duration-500 ${is2Winner ? 'bg-eco-blue shadow-glow-sm' : 'bg-eco-muted/50'}`}
                                style={{ width: `${Math.min(100, (stat.val2 / (stat.val1 + stat.val2 || 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Player 2 Card Details */}
                  <div className="flex flex-col items-center text-center gap-2 bg-eco-surface2/30 border border-white/5 p-3 rounded-xl">
                    {comparePlayers[1].avatar ? (
                      <img src={comparePlayers[1].avatar} alt={comparePlayers[1].name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/10 contrast-110 saturate-50" />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center font-display text-white text-2xl">
                        #{comparePlayers[1].number}
                      </div>
                    )}
                    <div>
                      <p className="font-heading font-bold text-white text-xs sm:text-sm leading-tight truncate max-w-[120px]">{comparePlayers[1].name}</p>
                      <p className="text-[10px] text-eco-muted uppercase tracking-widest">{comparePlayers[1].position} | {comparePlayers[1].height}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collector Card Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-eco-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlayer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-sm w-full bg-white p-6 pb-8 shadow-2xl rounded-sm transform rotate-1"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-eco-black/5 flex items-center justify-center text-eco-black hover:bg-eco-black/10 transition-colors z-30"
              >
                <X size={16} />
              </button>

              {/* Tape Effect */}
              <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-28 h-8 bg-white/70 backdrop-blur-sm -rotate-1 z-20 shadow-sm" />

              {/* Card Title/Logo Header */}
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  EcoHoops Roster Card
                </span>
                <span className="font-mono text-[10px] text-eco-blue bg-eco-blue/5 border border-eco-blue/10 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                  {selectedTeam.name}
                </span>
              </div>

              {/* Polaroid Image */}
              <div className="relative aspect-square mb-4 bg-gray-50 overflow-hidden border border-gray-200 shadow-inner rounded-sm">
                {selectedPlayer.avatar ? (
                  <img
                    src={selectedPlayer.avatar}
                    alt={selectedPlayer.name}
                    className="w-full h-full object-cover filter contrast-110 saturate-75 hover:saturate-100 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-7xl text-gray-200">
                    #{selectedPlayer.number}
                  </div>
                )}
                {/* Large Jersey Number overlay */}
                <div className="absolute top-4 right-5 font-display text-7xl text-white/35 drop-shadow-md select-none pointer-events-none">
                  {selectedPlayer.number}
                </div>
              </div>

              {/* Polaroid bottom caption */}
              <div className="text-center pt-2">
                <h3 className="font-graffiti text-eco-black text-3xl md:text-4xl tracking-wide -rotate-1 transform">
                  {selectedPlayer.name}
                </h3>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-around text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                  <div>
                    <p className="text-gray-300">Jersey</p>
                    <p className="font-bold text-eco-black text-sm">#{selectedPlayer.number}</p>
                  </div>
                  <div className="border-l border-gray-100" />
                  <div>
                    <p className="text-gray-300 font-heading">Division</p>
                    <p className="font-bold text-eco-black text-sm font-heading">{selectedTeam.ageGroup}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

interface PlayerCardProps {
  player: Player
  index: number
  isSelectedForCompare: boolean
  onToggleCompare: (e: React.MouseEvent) => void
  onClick: () => void
}

function PlayerCard({
  player,
  index,
  isSelectedForCompare,
  onToggleCompare,
  onClick,
}: PlayerCardProps) {
  // Alternate rotation for a scattered polaroid effect
  const isEven = index % 2 === 0
  const baseRotation = isEven ? 'rotate-2' : '-rotate-2'
  const hoverRotation = isEven ? 'hover:-rotate-1' : 'hover:rotate-1'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className={`relative h-fit bg-white p-3 pb-4 shadow-xl cursor-pointer transition-all duration-300 transform ${baseRotation} ${hoverRotation} hover:scale-105 hover:z-20 hover:shadow-2xl`}
    >
      {/* Tape Effect */}
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 backdrop-blur-sm -rotate-2 z-10 shadow-sm" />

      {/* Image Container */}
      <div className="relative aspect-square mb-2 bg-gray-100 overflow-hidden border border-gray-200">
        {player.avatar ? (
          <img
            src={player.avatar}
            alt={player.name}
            className="w-full h-full object-cover filter contrast-110 saturate-50 hover:saturate-100 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-4xl text-gray-300">
            #{player.number}
          </div>
        )}
        
        {/* Number Overlay */}
        <div className="absolute top-2 right-3 font-display text-5xl text-white/40 drop-shadow-md select-none pointer-events-none">
          {player.number}
        </div>
      </div>

      {/* Graffiti Info */}
      <div className="text-center">
        <p className="font-graffiti text-eco-black text-xl md:text-2xl tracking-wide -rotate-2 transform">
          {player.name}
        </p>
      </div>
    </motion.div>
  )
}
