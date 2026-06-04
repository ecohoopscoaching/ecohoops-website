import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Instagram, ExternalLink, Heart, MessageCircle } from 'lucide-react'

const INSTAGRAM_POSTS = [
  {
    id: '1',
    image: '/images/IMG_0493.JPG',
    likes: '234',
    comments: '18',
    caption: 'Team huddle before the big game. This is what it\'s all about.',
  },
  {
    id: '2',
    image: '/images/11.png',
    likes: '312',
    comments: '24',
    caption: 'Our 2012 girls squad ready to compete! Let\'s go!',
  },
  {
    id: '3',
    image: '/images/IMG_0379.JPG',
    likes: '189',
    comments: '12',
    caption: 'Rise up! Nothing but net.',
  },
  {
    id: '4',
    image: '/images/IMG_0281.JPG',
    likes: '276',
    comments: '31',
    caption: 'Coach breaking down the play. Building basketball IQ.',
  },
  {
    id: '5',
    image: '/images/IMG_0286.JPG',
    likes: '198',
    comments: '15',
    caption: 'Handle game strong. Drills that translate to real games.',
  },
  {
    id: '6',
    image: '/images/13.png',
    likes: '421',
    comments: '38',
    caption: 'The whole squad. One family. One mission.',
  },
  {
    id: '7',
    image: '/images/IMG_0350.JPG',
    likes: '156',
    comments: '9',
    caption: 'Find the open man. Court vision on point.',
  },
  {
    id: '8',
    image: '/images/IMG_0373.JPG',
    likes: '287',
    comments: '22',
    caption: 'Contested! Playing hard on both ends.',
  },
]

export default function InstagramFeed() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-eco-navy/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="tag mb-4 inline-block">
            <Instagram size={14} className="inline mr-2 -mt-0.5" />
            @ecohoopsbasketball
          </span>
          <h2 className="font-display text-section uppercase mb-4">
            <span className="text-white">FOLLOW THE </span>
            <span className="gradient-text">MOVEMENT</span>
          </h2>
          <p className="text-eco-muted-light text-lg max-w-xl mx-auto">
            Stay connected. Catch the latest from practice, game days, and everything in between.
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          {INSTAGRAM_POSTS.map((post, i) => (
            <motion.a
              key={post.id}
              href="https://www.instagram.com/ecohoopsbasketball/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-eco-navy/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-white">
                    <Heart size={18} fill="currentColor" />
                    <span className="font-heading font-bold text-sm">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white">
                    <MessageCircle size={18} fill="currentColor" />
                    <span className="font-heading font-bold text-sm">{post.comments}</span>
                  </div>
                </div>
                <p className="text-white/80 text-xs text-center px-4 line-clamp-2 max-w-[200px]">
                  {post.caption}
                </p>
              </div>

              {/* Instagram icon on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram size={18} className="text-white" />
              </div>

              {/* Border on hover */}
              <div className="absolute inset-0 rounded-xl border border-eco-blue/0 group-hover:border-eco-blue/40 transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <a
            href="https://www.instagram.com/ecohoopsbasketball/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center gap-2"
          >
            <Instagram size={18} />
            Follow @ecohoopsbasketball
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
