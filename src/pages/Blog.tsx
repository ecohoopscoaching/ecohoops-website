import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react'
import { BLOG_POSTS } from '../data/blogs'
import { blogService } from '../lib/blog-service'
import { BlogPost } from '../types'

export default function Blog() {
  const { ref, isVisible } = useScrollReveal(0.05)
  const [allPosts, setAllPosts] = useState<BlogPost[]>(BLOG_POSTS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const dbPosts = await blogService.getFirestorePosts()
      const combined = [...dbPosts, ...BLOG_POSTS].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setAllPosts(combined)
      setIsLoading(false)
    }
    fetchPosts()
  }, [])

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
          <span className="tag mb-4 inline-block">Our Journal</span>
          <h1 className="font-display text-section uppercase tracking-tight mb-6">
            <span className="text-white">THE ECOHOOPS </span>
            <span className="gradient-text">BLOG</span>
          </h1>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto">
            Thoughts on basketball, mental health, ecological dynamics, and building a stronger community.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && allPosts.length === BLOG_POSTS.length && (
            <div className="col-span-full flex justify-center py-10">
              <Loader2 className="animate-spin text-eco-orange" size={32} />
            </div>
          )}
          {allPosts.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-20">
              <h3 className="text-xl font-heading font-bold text-white mb-2">No Articles Yet</h3>
              <p className="text-eco-muted-light">Check back soon for new insights and updates from EcoHoops.</p>
            </div>
          )}
          {allPosts.map((post, index) => {
            const dateObj = new Date(post.date)
            const fullDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * (index % 6) }}
              >
                <Link to={`/blog/${post.slug}`} className="glow-card flex flex-col h-full overflow-hidden group cursor-pointer">
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-eco-surface2 flex items-center justify-center">
                        <span className="text-eco-orange font-display text-4xl">EH</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-eco-orange/90 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-eco-muted mb-4 uppercase tracking-wider font-mono">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {fullDate}</span>
                      <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-white mb-3 group-hover:text-eco-orange transition-colors line-clamp-3">
                      {post.title}
                    </h3>
                    <p className="text-sm text-eco-muted-light mb-6 flex-1 leading-relaxed line-clamp-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-eco-orange text-sm font-heading font-bold uppercase tracking-wider mt-auto">
                      Read Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
