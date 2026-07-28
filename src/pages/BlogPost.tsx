import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2, Calendar, User, Loader2 } from 'lucide-react'
import { BLOG_POSTS } from '../data/blogs'
import { blogService } from '../lib/blog-service'
import { BlogPost as BlogPostType } from '../types'

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      // 1. Try local memory first
      const localPost = BLOG_POSTS.find(p => p.slug === slug)
      if (localPost && !blogService.isPostDeleted(localPost.id)) {
        setPost(localPost)
        setIsLoading(false)
        return
      }

      // 2. Try Firestore
      if (slug) {
        const dbPost = await blogService.getBlogPostBySlug(slug)
        setPost(dbPost)
      }
      setIsLoading(false)
    }

    fetchPost()
  }, [slug])

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-eco-orange" size={48} />
      </div>
    )
  }
  if (!post) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center flex flex-col items-center justify-center">
        <h1 className="font-display text-4xl text-white mb-4">Article Not Found</h1>
        <p className="text-eco-muted mb-8">We couldn't locate this article in the archive.</p>
        <button onClick={() => navigate('/blog')} className="btn-glow">Return to Blog</button>
      </div>
    )
  }

  // Format the ISO Date back to standard string
  let fullDate = 'Recent'
  try {
    if (post.date) {
      const dateObj = new Date(post.date)
      if (!isNaN(dateObj.getTime())) {
        fullDate = dateObj.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      }
    }
  } catch (e) {
    console.error('Error formatting blog post date:', e)
  }

  return (
    <article className="pt-28 pb-20 min-h-screen max-w-4xl mx-auto px-6 lg:px-8">
      {/* Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <Link to="/blog" className="inline-flex items-center gap-2 text-eco-muted hover:text-eco-orange transition-colors duration-300">
          <ArrowLeft size={16} />
          <span className="text-sm font-heading font-semibold uppercase tracking-wider">Back to Articles</span>
        </Link>
        <button className="p-2 text-eco-muted hover:text-white bg-eco-surface2 hover:bg-eco-surface rounded-full transition-all border border-eco-border">
          <Share2 size={16} />
        </button>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex gap-3 mb-6">
          <span className="px-3 py-1 bg-eco-surface2 border border-eco-border rounded-full text-xs font-mono uppercase tracking-widest text-eco-orange">
            {post.category || 'Archive'}
          </span>
        </div>
        
        <h1 className="font-display text-3xl md:text-5xl text-white mb-6 uppercase tracking-tight leading-[1.1]">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-eco-muted font-heading">
          <div className="flex items-center gap-2">
            <User size={16} className="text-eco-orange" />
            {post.author}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-eco-orange" />
            {fullDate}
          </div>
        </div>
      </motion.div>

      {/* Featured Image */}
      {post.image && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full h-[300px] md:h-[500px] rounded-2xl md:rounded-[32px] overflow-hidden mb-16 border border-eco-border shadow-glow"
        >
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-eco-black/80 via-transparent to-transparent" />
        </motion.div>
      )}

      {/* Article Content injected from the raw scraped HTML */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-p:text-eco-muted prose-p:leading-relaxed prose-a:text-eco-blue hover:prose-a:text-eco-blue/80 prose-img:rounded-2xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
