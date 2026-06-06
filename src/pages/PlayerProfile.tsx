import { useState, useMemo } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Film, User, Crosshair, BarChart2, Calendar } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { Player } from '../types'
import { useData } from '../contexts/DataContext'

export default function PlayerProfile() {
  const { teamId, playerId } = useParams()
  const navigate = useNavigate()
  const { ref, isVisible } = useScrollReveal(0.05)
  const [selectedShotZone, setSelectedShotZone] = useState<string | null>(null)
  
  const { teams } = useData()
  const team = teams.find(t => t.id === teamId)
  const player = team?.roster.find(p => p.id === playerId)

  // Seeded random helper for stable simulated data
  const getSeededValue = (playerSeed: string, index: number, min: number, max: number) => {
    let hash = 0
    const str = playerSeed + index.toString()
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const rand = Math.abs(Math.sin(hash)) // 0 to 1
    return +(min + rand * (max - min)).toFixed(1)
  }

  // Scouting attributes calculation
  const attributes = useMemo(() => {
    if (!player) return null
    const { ppg, rpg, apg, spg, fgPct } = player.stats
    const seed = player.id

    return {
      courtVision: Math.min(99, Math.round(apg * 12 + getSeededValue(seed, 1, 10, 20))),
      finishing: Math.min(99, Math.round(fgPct * 1.1 + getSeededValue(seed, 2, 5, 15))),
      defense: Math.min(99, Math.round(spg * 25 + getSeededValue(seed, 3, 20, 30))),
      shootingRange: Math.min(99, Math.round(ppg * 3 + getSeededValue(seed, 4, 30, 45))),
      basketballIQ: Math.min(99, Math.round(apg * 8 + ppg * 1.5 + getSeededValue(seed, 5, 30, 40))),
      athleticism: Math.min(99, Math.round(rpg * 5 + getSeededValue(seed, 6, 45, 65)))
    }
  }, [player])

  // Custom scouting assessment
  const scoutingReport = useMemo(() => {
    if (!player) return ''
    const pos = player.position.toUpperCase()
    
    if (pos.includes('G') || pos.includes('PG') || pos.includes('SG')) {
      return `A dynamic playmaker who thrives in the transition game. Shows exceptional court vision, utilizing constraints-led spacing concepts to find open teammates. They possess active hands on defense, creating deflections and initiating early offense.`
    } else if (pos.includes('F') || pos.includes('SF') || pos.includes('PF')) {
      return `A highly versatile wing/forward option. Combines physical athleticism with a strong motor to dominate on both ends. Extremely comfortable working in the mid-range and finishing near the rim with high efficiency.`
    } else if (pos.includes('C')) {
      return `An anchor inside the paint. Controls the glass, secures possession, and alters opponent field goal attempts. Demonstrates superb post positioning and strong efficiency when finishing off penetration feeds.`
    }
    return `An impactful contributor who brings great team energy. Solid fundamental skill set that makes them a threat on offense and a disciplined defender in single-coverage scenarios.`
  }, [player])

  // Radar Chart coordinate generation
  const radarPoints = useMemo(() => {
    if (!player) return ''
    const { ppg, rpg, apg, spg, fgPct } = player.stats
    const center = 150
    const maxVal = 100

    // Scale raw stats out of 100
    const vals = [
      Math.min(95, Math.max(30, (ppg / 22) * 100)), // Scoring
      Math.min(95, Math.max(30, (rpg / 12) * 100)), // Rebounding
      Math.min(95, Math.max(30, (apg / 7) * 100)),  // Playmaking
      Math.min(95, Math.max(30, (spg / 3) * 100)),  // Defense
      Math.min(95, Math.max(30, ((fgPct - 25) / 35) * 100)), // Efficiency
    ]

    const coordinates = vals.map((val, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const radius = (val / maxVal) * 95
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      return `${x},${y}`
    })

    return coordinates.join(' ')
  }, [player])

  // Seeded game log generation
  const gameLog = useMemo(() => {
    if (!player) return []
    const seed = player.id
    const opponents = ['Brampton Warriors', 'Vaughan Panthers', 'Toronto Lords', 'Milton Stags', 'Oakville Vytis']
    const dates = ['2026-02-12', '2026-02-19', '2026-02-26', '2026-03-05', '2026-03-12']
    const results = ['W 64-58', 'W 78-70', 'L 62-66', 'W 81-72', 'W 73-69']

    return dates.map((date, i) => {
      const p = getSeededValue(seed, i + 10, player.stats.ppg - 5, player.stats.ppg + 6)
      const r = getSeededValue(seed, i + 20, player.stats.rpg - 3, player.stats.rpg + 3)
      const a = getSeededValue(seed, i + 30, player.stats.apg - 2, player.stats.apg + 3)
      const s = getSeededValue(seed, i + 40, player.stats.spg - 1, player.stats.spg + 1.5)
      const f = getSeededValue(seed, i + 50, player.stats.fgPct - 10, player.stats.fgPct + 12)

      return {
        opponent: opponents[i],
        date,
        result: results[i],
        pts: Math.max(0, Math.round(p)),
        reb: Math.max(0, Math.round(r)),
        ast: Math.max(0, Math.round(a)),
        stl: Math.max(0, Math.round(s)),
        fg: Math.min(100, Math.max(0, Math.round(f)))
      }
    })
  }, [player])

  // Court shot zones detail configuration
  const shotZones = useMemo(() => {
    if (!player) return {}
    const baseFg = player.stats.fgPct
    const seed = player.id

    return {
      paint: { label: 'Paint & Rim', fg: Math.min(99, Math.round(baseFg + getSeededValue(seed, 80, 5, 12))), desc: 'High frequency zone. Thrives off drives and drop-off passes.' },
      midRange: { label: 'Mid-Range Jumpers', fg: Math.min(99, Math.round(baseFg - getSeededValue(seed, 81, 2, 8))), desc: 'Comfortable pull-up options off pick-and-roll constraints.' },
      corners: { label: 'Corner 3-Pointers', fg: Math.min(99, Math.round(baseFg - getSeededValue(seed, 82, 4, 10))), desc: 'Active kick-out option. High efficiency in spot-up plays.' },
      wings: { label: 'Wing 3-Pointers', fg: Math.min(99, Math.round(baseFg - getSeededValue(seed, 83, 6, 12))), desc: 'Reliable floor-stretching capability. Excellent rotation safety.' },
      topKey: { label: 'Top of the Key', fg: Math.min(99, Math.round(baseFg - getSeededValue(seed, 84, 8, 15))), desc: 'Initial spacing trigger. Good fallback shooting option.' }
    }
  }, [player])

  if (!team || !player || !attributes || !shotZones) {
    return <Navigate to="/teams" replace />
  }

  // Calculate radar grid lines coordinates
  const radarGridLines = [20, 40, 60, 80, 100].map((level) => {
    const center = 150
    return Array.from({ length: 5 }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const radius = (level / 100) * 95
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')
  })

  return (
    <div className="pt-28 pb-20 min-h-screen bg-eco-black relative overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-eco-blue/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/teams')}
          className="flex items-center gap-2 text-eco-muted hover:text-white transition-colors mb-8 uppercase font-heading text-sm tracking-widest"
        >
          <ArrowLeft size={16} />
          Back to Roster
        </button>

        {/* Hero Section */}
        <section ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20 items-center">
          {/* Polaroid Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50, rotate: -5 }}
            animate={isVisible ? { opacity: 1, x: 0, rotate: -2 } : {}}
            transition={{ duration: 0.7, type: 'spring' }}
            className="relative bg-white p-4 pb-12 shadow-2xl mx-auto max-w-md w-full"
          >
            {/* Polaroid Tape */}
            <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-32 h-8 bg-white/70 backdrop-blur-md -rotate-3 z-10 shadow-sm" />
            
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative border border-gray-200">
              {player.avatar ? (
                <img 
                  src={player.avatar} 
                  alt={player.name}
                  className="w-full h-full object-cover filter contrast-110 saturate-50 hover:saturate-100 transition-all duration-500"
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
              <span className="bg-eco-blue text-eco-black text-xs px-3 py-1 rounded-md font-heading font-bold uppercase tracking-widest">
                {team.season}
              </span>
              <span className="border border-eco-border text-eco-blue text-xs px-3 py-1 rounded-md font-heading uppercase tracking-widest">
                {player.position}
              </span>
              <span className="border border-eco-border text-eco-muted-light text-xs px-3 py-1 rounded-md font-heading uppercase tracking-widest">
                {player.height}
              </span>
              <span className="border border-eco-border text-eco-muted-light text-xs px-3 py-1 rounded-md font-heading uppercase tracking-widest">
                Age: {player.age}
              </span>
            </div>

            <h1 className="font-display text-[clamp(4rem,8vw,8rem)] leading-none text-white uppercase mb-2 drop-shadow-md">
              {player.name.split(' ')[0]} <br/>
              <span className="gradient-text">{player.name.split(' ').slice(1).join(' ')}</span>
            </h1>

            <div className="h-1 w-24 bg-gradient-to-r from-eco-blue to-eco-blue-light mb-8 mt-6"></div>

            <h3 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-eco-blue" />
              PLAYER BIO
            </h3>
            <p className="text-eco-muted-light leading-relaxed text-lg mb-8 max-w-xl">
              An integral part of the {team.name} squad. Known for exceptional court vision, relentless defense, and the ability to make clutch plays down the stretch. Bringing energy and leadership to every game this season.
            </p>

            {/* Core Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-xl">
              {[
                { label: 'PPG', value: player.stats.ppg },
                { label: 'RPG', value: player.stats.rpg },
                { label: 'APG', value: player.stats.apg },
                { label: 'SPG', value: player.stats.spg },
                { label: 'FG%', value: `${player.stats.fgPct}%` },
              ].map((stat) => (
                <div key={stat.label} className="bg-eco-surface border border-eco-border p-4 text-center rounded-xl relative overflow-hidden group hover:border-eco-blue/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-eco-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="font-display text-2xl text-white relative z-10">{stat.value}</p>
                  <p className="font-mono text-[10px] text-eco-muted uppercase tracking-wider relative z-10">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 2: Radar Chart & Scouting Report */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 pt-16 border-t border-eco-border/40">
          {/* Radar Chart (Science Side) */}
          <div className="bg-eco-surface border border-eco-border rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-6 w-full text-left flex items-center gap-2 border-b border-eco-border pb-3">
              <BarChart2 size={22} className="text-eco-blue" />
              Scouting Radar Profile
            </h3>
            
            <div className="relative w-[300px] h-[300px]">
              <svg className="w-full h-full" viewBox="0 0 300 300">
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Draw Concentric Grid Polygons */}
                {radarGridLines.map((points, idx) => (
                  <polygon 
                    key={idx} 
                    points={points} 
                    fill="none" 
                    stroke="rgba(151,179,210,0.08)" 
                    strokeWidth="1.5" 
                  />
                ))}

                {/* Draw Radial Axle lines */}
                {Array.from({ length: 5 }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
                  const x = 150 + 95 * Math.cos(angle)
                  const y = 150 + 95 * Math.sin(angle)
                  return (
                    <line 
                      key={i} 
                      x1="150" 
                      y1="150" 
                      x2={x} 
                      y2={y} 
                      stroke="rgba(151,179,210,0.15)" 
                      strokeWidth="1" 
                    />
                  )
                })}

                {/* Dynamic Player Area Polygon */}
                {radarPoints && (
                  <polygon 
                    points={radarPoints} 
                    fill="rgba(151,179,210,0.2)" 
                    stroke="#97B3D2" 
                    strokeWidth="2.5" 
                    filter="url(#glow)" 
                  />
                )}

                {/* Vertex Marker Circles */}
                {radarPoints.split(' ').map((pt, i) => {
                  const [x, y] = pt.split(',')
                  return (
                    <circle 
                      key={i} 
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="#FFFFFF" 
                      stroke="#97B3D2" 
                      strokeWidth="2" 
                    />
                  )
                })}
              </svg>

              {/* Positioned HTML Labels around the SVG */}
              {[
                { label: 'Scoring', style: 'top-2 left-1/2 -translate-x-1/2' },
                { label: 'Rebounding', style: 'top-[95px] right-0' },
                { label: 'Playmaking', style: 'bottom-[42px] right-4' },
                { label: 'Defense', style: 'bottom-[42px] left-4' },
                { label: 'Efficiency', style: 'top-[95px] left-0' },
              ].map((lbl, idx) => (
                <div 
                  key={idx} 
                  className={`absolute font-mono text-[10px] font-bold uppercase tracking-wider text-eco-muted-light bg-eco-surface2 px-2 py-0.5 border border-white/5 rounded shadow-md pointer-events-none select-none ${lbl.style}`}
                >
                  {lbl.label}
                </div>
              ))}
            </div>
          </div>

          {/* Scouting Attributes Breakdown */}
          <div className="bg-eco-surface border border-eco-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-6 flex items-center gap-2 border-b border-eco-border pb-3">
                <User size={22} className="text-eco-blue" />
                Scouting Assessment
              </h3>
              <p className="text-eco-muted-light italic text-base leading-relaxed mb-6">
                "{scoutingReport}"
              </p>
            </div>

            {/* Slider Attributes */}
            <div className="space-y-4">
              {[
                { label: 'Court Vision & Passing', value: attributes.courtVision },
                { label: 'Finishing & Rim Pressure', value: attributes.finishing },
                { label: 'On-Ball Defense', value: attributes.defense },
                { label: 'Outside Shooting Range', value: attributes.shootingRange },
                { label: 'Basketball IQ & Position Play', value: attributes.basketballIQ },
                { label: 'Athleticism & Lateral Speed', value: attributes.athleticism },
              ].map((attr) => (
                <div key={attr.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-heading font-semibold uppercase tracking-wider text-white">
                    <span>{attr.label}</span>
                    <span className="text-eco-blue font-mono">{attr.value} / 99</span>
                  </div>
                  <div className="h-2 w-full bg-eco-surface2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-eco-blue to-eco-blue-light shadow-glow-sm rounded-full" 
                      style={{ width: `${attr.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Court Shot Chart & Recent Games */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 pt-16 border-t border-eco-border/40">
          {/* Interactive Shot Chart */}
          <div className="bg-eco-surface border border-eco-border rounded-2xl p-6 sm:p-8 relative">
            <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-6 flex items-center gap-2 border-b border-eco-border pb-3">
              <Crosshair size={22} className="text-eco-blue" />
              Shot Chart Analysis
            </h3>
            <p className="text-xs text-eco-muted uppercase tracking-widest mb-6">
              Click court hotspots to inspect shot efficiencies
            </p>

            <div className="relative aspect-[300/250] max-w-sm mx-auto bg-eco-surface2 rounded-xl border border-white/5 p-4 flex items-center justify-center">
              {/* Half Court SVG */}
              <svg className="w-full h-full text-eco-border/20" viewBox="0 0 300 250" fill="none" stroke="currentColor" strokeWidth="2">
                {/* Court outline */}
                <rect x="5" y="5" width="290" height="240" rx="4" />
                {/* Key Paint */}
                <rect x="110" y="5" width="80" height="90" />
                {/* Free throw circle */}
                <path d="M 110 95 A 40 40 0 0 0 190 95" />
                <path d="M 110 95 A 40 40 0 0 1 190 95" strokeDasharray="4,4" />
                {/* 3pt line */}
                <path d="M 5 60 L 25 60 A 130 130 0 0 0 275 60 L 295 60" />
                {/* Backboard and Rim */}
                <line x1="135" y1="20" x2="165" y2="20" strokeWidth="3" />
                <circle cx="150" cy="27" r="7" />
              </svg>

              {/* Interactive Hotspot Buttons */}
              {[
                { zone: 'paint', label: 'Paint', x: '150px', y: '40px' },
                { zone: 'midRange', label: 'Midrange', x: '150px', y: '110px' },
                { zone: 'corners', label: 'Corner', x: '35px', y: '40px' },
                { zone: 'wings', label: 'Wing', x: '65px', y: '120px' },
                { zone: 'topKey', label: 'Top of Key', x: '150px', y: '180px' },
              ].map((hotspot) => {
                const isSelected = selectedShotZone === hotspot.zone
                const stats = shotZones[hotspot.zone as keyof typeof shotZones]
                return (
                  <button
                    key={hotspot.zone}
                    onClick={() => setSelectedShotZone(isSelected ? null : hotspot.zone)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: hotspot.x, top: hotspot.y }}
                  >
                    {/* Ring Pulse */}
                    <span className="absolute -inset-2 rounded-full bg-eco-blue/20 animate-ping group-hover:bg-eco-blue/30" />
                    {/* Circle Node */}
                    <span className={`relative flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                      isSelected 
                        ? 'bg-white text-eco-black border-white shadow-glow-sm scale-115' 
                        : 'bg-eco-surface2 text-eco-blue border-eco-blue/50 group-hover:bg-eco-blue group-hover:text-eco-black group-hover:scale-110'
                    }`}>
                      <span className="text-[8px] font-mono font-bold">{stats?.fg}%</span>
                    </span>
                  </button>
                )
              })}

              {/* Click Detail Overlay Overlay Card */}
              <AnimatePresence>
                {selectedShotZone && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 bg-eco-surface/95 backdrop-blur-md border border-eco-blue/30 rounded-xl p-3 shadow-xl z-20"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                        {shotZones[selectedShotZone as keyof typeof shotZones]?.label}
                      </h4>
                      <span className="font-mono text-xs font-extrabold text-eco-blue">
                        {shotZones[selectedShotZone as keyof typeof shotZones]?.fg}% FG
                      </span>
                    </div>
                    <p className="text-[11px] text-eco-muted-light leading-relaxed">
                      {shotZones[selectedShotZone as keyof typeof shotZones]?.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Recent Game Log */}
          <div className="bg-eco-surface border border-eco-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-6 flex items-center gap-2 border-b border-eco-border pb-3">
                <Calendar size={22} className="text-eco-blue" />
                Recent Game Log
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-heading">
                  <thead>
                    <tr className="border-b border-eco-border/40 text-eco-muted uppercase tracking-wider">
                      <th className="py-2.5">Opponent</th>
                      <th className="py-2.5 text-center">Result</th>
                      <th className="py-2.5 text-center">PTS</th>
                      <th className="py-2.5 text-center">REB</th>
                      <th className="py-2.5 text-center">AST</th>
                      <th className="py-2.5 text-center">STL</th>
                      <th className="py-2.5 text-center">FG%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameLog.map((game, i) => (
                      <tr key={i} className="border-b border-eco-border/20 hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 font-semibold text-white">
                          <p className="leading-none">{game.opponent}</p>
                          <span className="text-[9px] text-eco-muted font-mono">{game.date}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded font-mono font-bold text-[9px] ${
                            game.result.startsWith('W') 
                              ? 'bg-eco-blue/15 text-eco-blue border border-eco-blue/30' 
                              : 'bg-white/5 text-eco-muted border border-white/10'
                          }`}>
                            {game.result}
                          </span>
                        </td>
                        <td className="py-3 text-center font-mono font-bold text-white">{game.pts}</td>
                        <td className="py-3 text-center font-mono text-eco-muted-light">{game.reb}</td>
                        <td className="py-3 text-center font-mono text-eco-muted-light">{game.ast}</td>
                        <td className="py-3 text-center font-mono text-eco-muted-light">{game.stl}</td>
                        <td className="py-3 text-center font-mono text-eco-muted-light">{game.fg}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
                  <div className="w-20 h-20 rounded-full bg-eco-blue/90 flex items-center justify-center pl-2 group-hover:scale-110 transition-transform shadow-glow-sm text-eco-black">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                      <path d="M8 5v14l11-7z" />
                    </svg>
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
