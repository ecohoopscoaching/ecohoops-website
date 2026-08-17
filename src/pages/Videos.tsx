import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Play, Clock, Eye, Filter, ExternalLink, Youtube, Film, ChevronRight } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

type VideoCategory = 'all' | 'highlights' | 'training' | 'recaps' | 'culture'
type PageTab = 'clips' | 'fullgames'

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: string
  category: VideoCategory
  date: string
  description: string
  featured?: boolean
}

const YOUTUBE_PLAYLIST_ID = 'PLs1EFeW6jHRkBob2wMjvC5tCjw2GRwOb9'
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/playlist?list=PLs1EFeW6jHRkBob2wMjvC5tCjw2GRwOb9'

const VIDEOS: Video[] = [
  {
    id: '1',
    title: 'EcoHoops Season Highlights 2025',
    thumbnail: '/images/IMG_0373.JPG',
    duration: '4:32',
    views: '2.1K',
    category: 'highlights',
    date: 'Mar 2025',
    description: 'The best plays, moments, and memories from our 2025 season.',
    featured: true,
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
  {
    id: '4',
    title: 'Girls Program: Building Confidence',
    thumbnail: '/images/IMG_0279.JPG',
    duration: '3:45',
    views: '1.9K',
    category: 'culture',
    date: 'Mar 2025',
    description: 'How our girls program is changing lives on and off the court.',
    featured: true,
  },
  {
    id: '5',
    title: 'Defensive Footwork Fundamentals',
    thumbnail: '/images/IMG_0286.JPG',
    duration: '5:50',
    views: '2.5K',
    category: 'training',
    date: 'Dec 2024',
    description: 'Learn the footwork patterns that make exceptional defenders.',
  },
  {
    id: '6',
    title: '2012 Girls Tournament Highlights',
    thumbnail: '/images/IMG_0134.JPG',
    duration: '3:10',
    views: '1.2K',
    category: 'highlights',
    date: 'Feb 2025',
    description: 'Our 2012 girls squad showing out at the winter tournament.',
  },
  {
    id: '7',
    title: 'Team Culture: The EcoHoops Way',
    thumbnail: '/images/IMG_0493.JPG',
    duration: '7:00',
    views: '4.2K',
    category: 'culture',
    date: 'Nov 2024',
    description: 'What makes EcoHoops different? Hear from players, parents, and coaches.',
  },
  {
    id: '8',
    title: 'Shooting Form Breakdown',
    thumbnail: '/images/IMG_0409.JPG',
    duration: '4:15',
    views: '5.1K',
    category: 'training',
    date: 'Jan 2025',
    description: 'Perfect your shooting form with these key mechanics.',
  },
  {
    id: '9',
    title: 'Practice at OVO Athletic Centre',
    thumbnail: '/images/IMG_0312.JPG',
    duration: '2:30',
    views: '3.3K',
    category: 'recaps',
    date: 'Dec 2024',
    description: 'Behind the scenes at our special practice session at the Raptors facility.',
  },
  {
    id: '10',
    title: 'Pre-Game Warmup Routine',
    thumbnail: '/images/IMG_0340.JPG',
    duration: '3:55',
    views: '1.7K',
    category: 'training',
    date: 'Feb 2025',
    description: 'The complete EcoHoops pre-game warmup routine.',
  },
  {
    id: '11',
    title: 'End of Season Awards Night',
    thumbnail: '/images/IMG_0481.JPG',
    duration: '5:20',
    views: '2.8K',
    category: 'culture',
    date: 'Mar 2025',
    description: 'Celebrating our players achievements at the annual awards night.',
  },
  {
    id: '12',
    title: 'Fast Break Offense Explained',
    thumbnail: '/images/IMG_0357.JPG',
    duration: '6:40',
    views: '1.6K',
    category: 'training',
    date: 'Jan 2025',
    description: 'How we run our transition offense for maximum efficiency.',
  },
]

const CATEGORIES: { label: string; value: VideoCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Highlights', value: 'highlights' },
  { label: 'Training', value: 'training' },
  { label: 'Game Recaps', value: 'recaps' },
  { label: 'Culture', value: 'culture' },
]

const CATEGORY_COLORS: Record<string, string> = {
  highlights: '#B0C8E0',
  training: '#6A9BC7',
  recaps: '#97B3D2',
  culture: '#4A7FB5',
}

export default function Videos() {
  useDocumentTitle('Media & Highlights')

  const [tab, setTab] = useState<PageTab>('fullgames')
  const [filter, setFilter] = useState<VideoCategory>('all')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const { ref, isVisible } = useScrollReveal(0.05)

  const filtered = filter === 'all' ? VIDEOS : VIDEOS.filter((v) => v.category === filter)
  const featured = VIDEOS.filter((v) => v.featured)

  return (
    <section ref={ref} className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <span className="tag mb-4 inline-block">Media</span>
          <h1 className="font-display text-section uppercase mb-4">
            <span className="text-white">THE </span>
            <span className="gradient-text">FILM ROOM</span>
          </h1>
          <p className="text-eco-muted-light text-lg max-w-xl">
            Highlights, training content, full games, and behind-the-scenes moments.
          </p>
        </motion.div>

        {/* Page Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 mb-12"
        >
          <button
            onClick={() => setTab('fullgames')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
              tab === 'fullgames'
                ? 'bg-eco-orange text-white shadow-glow-sm'
                : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-orange/30'
            }`}
          >
            <Youtube size={16} />
            Full Games
          </button>
          <button
            onClick={() => setTab('clips')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
              tab === 'clips'
                ? 'bg-eco-orange text-white shadow-glow-sm'
                : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-orange/30'
            }`}
          >
            <Film size={16} />
            Clips & Highlights
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === 'clips' ? (
            <motion.div
              key="clips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Featured Videos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {featured.map((video) => (
                  <div
                    key={video.id}
                    className="glow-card overflow-hidden group cursor-pointer"
                    onClick={() => setPlayingId(playingId === video.id ? null : video.id)}
                  >
                    <div className="relative h-[260px] md:h-[300px] overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-eco-black via-eco-black/30 to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300"
                        >
                          <Play size={32} className="text-white ml-1" fill="currentColor" />
                        </motion.div>
                      </div>

                      <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-eco-black/70 backdrop-blur-sm text-xs font-mono text-white flex items-center gap-1">
                        <Clock size={12} />
                        {video.duration}
                      </div>

                      <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-eco-navy-bright/80 backdrop-blur-sm text-xs font-heading font-bold uppercase tracking-wider text-eco-blue-light">
                        Featured
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="px-2 py-0.5 rounded-md text-xs font-mono uppercase tracking-wider"
                          style={{
                            color: CATEGORY_COLORS[video.category],
                            backgroundColor: `${CATEGORY_COLORS[video.category]}15`,
                          }}
                        >
                          {video.category}
                        </span>
                        <span className="text-xs text-eco-muted">{video.date}</span>
                      </div>
                      <h3 className="font-heading font-bold text-xl text-white mb-2 group-hover:text-eco-blue-light transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-eco-muted-light">{video.description}</p>
                      <div className="flex items-center gap-1 mt-3 text-xs text-eco-muted">
                        <Eye size={12} />
                        {video.views} views
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter Bar */}
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                <Filter size={16} className="text-eco-muted" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setFilter(cat.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-heading font-semibold uppercase tracking-wider transition-all duration-300 ${
                      filter === cat.value
                        ? 'bg-eco-orange text-white shadow-glow-sm'
                        : 'bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-orange/30'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((video, i) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      index={i}
                      isVisible={isVisible}
                      isPlaying={playingId === video.id}
                      onPlay={() => setPlayingId(playingId === video.id ? null : video.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-eco-muted text-lg">No videos in this category yet.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="fullgames"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <FullGamesSection isVisible={isVisible} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ─── Full Games Tab ─── */
function FullGamesSection({ isVisible }: { isVisible: boolean }) {
  const [activeGame, setActiveGame] = useState(0)

  return (
    <div>
      {/* YouTube Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="glow-card overflow-hidden mb-10"
      >
        <div className="relative">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="/images/IMG_0357.JPG"
              alt="Game action"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-eco-black/90 via-eco-black/70 to-eco-black/50" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
            <div className="w-16 h-16 rounded-2xl bg-[#FF0000]/20 border border-[#FF0000]/30 flex items-center justify-center flex-shrink-0">
              <Youtube size={32} className="text-[#FF0000]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-2xl md:text-3xl uppercase text-white mb-2">
                ECOHOOPS ON YOUTUBE
              </h2>
              <p className="text-eco-muted-light text-sm max-w-lg">
                Watch full-length game recordings from our 2012 Girls and 2011 Boys teams.
                Every game, every play, every moment — uncut and unfiltered.
              </p>
            </div>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow flex items-center gap-2 !bg-[#FF0000] !border-[#FF0000]/50 hover:!shadow-[0_0_30px_rgba(255,0,0,0.3)] flex-shrink-0"
            >
              <Youtube size={16} />
              Subscribe
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Main Playlist Embed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#FF0000]/15 flex items-center justify-center">
            <Play size={16} className="text-[#FF0000]" fill="currentColor" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wide">
            Full Game Playlist
          </h3>
          <div className="flex-1 h-px bg-eco-border" />
        </div>

        <div className="glow-card overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}&rel=0&modestbranding=1&color=white`}
              title="EcoHoops Full Games Playlist"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Game Selector Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-eco-navy-bright/30 flex items-center justify-center">
            <Film size={16} className="text-eco-blue" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wide">
            Recent Games
          </h3>
          <div className="flex-1 h-px bg-eco-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RECENT_GAMES.map((game, i) => (
            <motion.a
              key={game.id}
              href={game.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="glow-card overflow-hidden group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative h-[170px] overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-eco-black/80 via-eco-black/20 to-transparent" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#FF0000]/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Play size={22} className="text-white ml-0.5" fill="currentColor" />
                  </div>
                </div>

                {/* YouTube badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-eco-black/70 backdrop-blur-sm">
                  <Youtube size={12} className="text-[#FF0000]" />
                  <span className="text-[10px] font-mono text-white uppercase">Full Game</span>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-eco-black/70 backdrop-blur-sm text-xs font-mono text-white flex items-center gap-1">
                  <Clock size={10} />
                  {game.duration}
                </div>

                {/* Score overlay */}
                {game.score && (
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-eco-navy/80 backdrop-blur-sm">
                    <span className="text-xs font-heading font-bold text-white">{game.score}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-mono uppercase tracking-wider"
                    style={{ color: game.teamColor }}
                  >
                    {game.team}
                  </span>
                  <span className="text-eco-muted text-[10px]">&middot;</span>
                  <span className="text-eco-muted text-[10px]">{game.date}</span>
                </div>
                <h3 className="font-heading font-bold text-sm text-white mb-1 group-hover:text-eco-blue-light transition-colors">
                  {game.title}
                </h3>
                <p className="text-[11px] text-eco-muted-light line-clamp-1">{game.description}</p>
                <div className="flex items-center gap-1 mt-3 text-[10px] text-eco-muted group-hover:text-[#FF0000] transition-colors">
                  <ExternalLink size={10} />
                  Watch on YouTube
                  <ChevronRight size={10} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* View All on YouTube */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-12"
      >
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost inline-flex items-center gap-2"
        >
          <Youtube size={18} className="text-[#FF0000]" />
          View All Games on YouTube
          <ExternalLink size={14} />
        </a>
      </motion.div>
    </div>
  )
}

/* ─── Recent Games Data ─── */
interface GameVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
  team: string
  teamColor: string
  date: string
  description: string
  score?: string
  youtubeUrl: string
}

const RECENT_GAMES: GameVideo[] = [
  {
    id: 'fg1',
    title: '2012 Girls vs Hamilton Flames',
    thumbnail: '/images/IMG_0134.JPG',
    duration: '42:15',
    team: '2012 Girls',
    teamColor: '#B0C8E0',
    date: 'Mar 2025',
    description: 'Regular season matchup at David Braley Centre',
    score: 'W 38-29',
    youtubeUrl: `https://youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`,
  },
  {
    id: 'fg2',
    title: '2011 Boys vs Raptors Prep',
    thumbnail: '/images/IMG_0373.JPG',
    duration: '48:30',
    team: '2011 Boys',
    teamColor: '#97B3D2',
    date: 'Mar 2025',
    description: 'Home game at Hershey Centre, Mississauga',
    score: 'W 45-41',
    youtubeUrl: `https://youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`,
  },
  {
    id: 'fg3',
    title: '2012 Girls vs North York Knights',
    thumbnail: '/images/3.png',
    duration: '39:45',
    team: '2012 Girls',
    teamColor: '#B0C8E0',
    date: 'Feb 2025',
    description: 'Tournament semi-finals showdown',
    score: 'W 42-35',
    youtubeUrl: `https://youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`,
  },
  {
    id: 'fg4',
    title: '2011 Boys vs Brampton Ballers',
    thumbnail: '/images/IMG_0349.JPG',
    duration: '45:20',
    team: '2011 Boys',
    teamColor: '#97B3D2',
    date: 'Feb 2025',
    description: 'League game at the OVO Athletic Centre',
    score: 'W 52-44',
    youtubeUrl: `https://youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`,
  },
  {
    id: 'fg5',
    title: '2012 Girls vs Mississauga Magic',
    thumbnail: '/images/IMG_0444.JPG',
    duration: '41:10',
    team: '2012 Girls',
    teamColor: '#B0C8E0',
    date: 'Jan 2025',
    description: 'Season opener with a dominant performance',
    score: 'W 36-22',
    youtubeUrl: `https://youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`,
  },
  {
    id: 'fg6',
    title: '2011 Boys vs Scarborough Stingers',
    thumbnail: '/images/IMG_0427.JPG',
    duration: '47:55',
    team: '2011 Boys',
    teamColor: '#97B3D2',
    date: 'Jan 2025',
    description: 'Intense rivalry game going down to the wire',
    score: 'L 39-42',
    youtubeUrl: `https://youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`,
  },
]

/* ─── Video Card Component ─── */
function VideoCard({
  video,
  index,
  isVisible,
  isPlaying,
  onPlay,
}: {
  video: Video
  index: number
  isVisible: boolean
  isPlaying: boolean
  onPlay: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onPlay}
      className="glow-card overflow-hidden group cursor-pointer"
    >
      <div className="relative h-[180px] overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
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
  )
}
