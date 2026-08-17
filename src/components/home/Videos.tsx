import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Play, Clock, Eye, Film } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: string
  category: 'highlights' | 'training' | 'recaps' | 'culture'
  date: string
  description: string
}

const PREVIEW_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'EcoHoops Season Highlights 2025',
    thumbnail: '/images/IMG_0373.JPG',
    duration: '4:32',
    views: '2.1K',
    category: 'highlights',
    date: 'Mar 2025',
    description: 'The best plays, moments, and memories from our 2025 season.',
  },
  {
    id: '2',
    title: 'Game Day: 2011 Boys vs. North Stars',
    thumbnail: '/images/IMG_0379.JPG',
    duration: '8:15',
    views: '1.4K',
    category: 'recaps',
    date: 'Feb 2025',
    description: 'Full game recap with highlights and post-game interviews.',
  },
  {
    id: '3',
    title: 'Ball Handling Drills with Coach',
    thumbnail: '/images/2.png',
    duration: '6:20',
    views: '3.8K',
    category: 'training',
    date: 'Jan 2025',
    description: 'Master these 5 essential ball handling drills to improve your game.',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  highlights: '#B0C8E0',
  training: '#6A9BC7',
  recaps: '#97B3D2',
  culture: '#4A7FB5',
}

export default function Videos() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-eco-black border-t border-eco-border/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Game Footage & Proof</span>
          <h2 className="font-display text-4xl md:text-6xl uppercase text-white">
            THE <span className="gradient-text">FILM ROOM</span>
          </h2>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto mt-4">
            Watch our Mississauga basketball training in action and check out real game footage from our rep teams.
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PREVIEW_VIDEOS.map((video, i) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setPlayingId(playingId === video.id ? null : video.id)}
              className="glow-card overflow-hidden group cursor-pointer"
            >
              <div className="relative h-[180px] overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-eco-black/70 via-transparent to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Play size={22} className="text-white ml-0.5" fill="currentColor" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-eco-black/70 backdrop-blur-sm text-xs font-mono text-white flex items-center gap-1">
                  <Clock size={10} />
                  {video.duration}
                </div>

                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: CATEGORY_COLORS[video.category] }}
                />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-mono uppercase tracking-wider"
                    style={{ color: CATEGORY_COLORS[video.category] }}
                  >
                    {video.category}
                  </span>
                  <span className="text-eco-muted text-[10px]">&middot;</span>
                  <span className="text-eco-muted text-[10px]">{video.date}</span>
                </div>
                <h3 className="font-heading font-bold text-sm text-white mb-1 group-hover:text-eco-blue-light transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-eco-muted">
                  <Eye size={10} />
                  {video.views} views
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Watch More Games Button */}
        <div className="text-center">
          <Link to="/videos" className="btn-ghost inline-flex items-center gap-2 cursor-pointer font-bold uppercase tracking-wider text-white">
            <Film size={16} className="text-eco-orange" />
            Watch More Games
          </Link>
        </div>
      </div>
    </section>
  )
}
