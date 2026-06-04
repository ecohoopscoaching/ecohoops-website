import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { blogService } from '../lib/blog-service'
import { ArrowLeft, Save, Image as ImageIcon, Layout, FileText, User, Type } from 'lucide-react'

export default function AdminBlog() {
  const { isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Innovation',
    excerpt: '',
    author: 'Adrian Sapp',
    image: '',
    content: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login')
    }
  }, [isAdmin, authLoading, navigate])

  // Auto-generate slug from title
  useEffect(() => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
    setFormData(prev => ({ ...prev, slug }))
  }, [formData.title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    const result = await blogService.addBlogPost(formData)

    if (result.success) {
      setMessage({ type: 'success', text: 'Blog post published successfully!' })
      // Reset form or navigate
      setTimeout(() => navigate('/blog'), 1500)
    } else {
      setMessage({ type: 'error', text: 'Failed to publish post. Please try again.' })
    }
    setIsSubmitting(false)
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="pt-28 pb-20 min-h-screen bg-eco-dark">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-eco-muted-light hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glow-card p-8 rounded-3xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-eco-orange/20 rounded-2xl flex items-center justify-center">
              <FileText className="text-eco-orange" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-display uppercase tracking-tight text-white">Create New Post</h1>
              <p className="text-eco-muted-light text-sm italic">Drafting for the EcoHoops Journal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-eco-muted flex items-center gap-2">
                  <Type size={12} /> Post Title
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="The Future of Youth Sports..."
                  className="w-full bg-eco-surface2 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-eco-muted flex items-center gap-2">
                  <Layout size={12} /> URL Slug
                </label>
                <input
                  required
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-eco-surface2/50 border border-white/5 rounded-xl px-4 py-3 text-eco-muted-light font-mono text-xs focus:outline-none focus:border-eco-orange/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-eco-muted flex items-center gap-2">
                   Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-eco-surface2 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50"
                >
                  <option>Innovation</option>
                  <option>Philosophy</option>
                  <option>Psychology</option>
                  <option>Training</option>
                  <option>Community</option>
                  <option>Archive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-eco-muted flex items-center gap-2">
                  <User size={12} /> Author
                </label>
                <input
                  required
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-eco-surface2 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-eco-muted flex items-center gap-2">
                  <ImageIcon size={12} /> Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-eco-surface2 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-eco-muted flex items-center gap-2">
                Excerpt
              </label>
              <textarea
                required
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary of the post..."
                className="w-full bg-eco-surface2 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50 transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-eco-muted flex items-center gap-2">
                Content (HTML Supported)
              </label>
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="<h3>Write your masterpiece here...</h3>"
                className="w-full bg-eco-surface2 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50 transition-colors font-mono text-sm"
              />
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl text-center text-sm font-medium ${
                message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {message.text}
              </div>
            )}

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-4 bg-eco-orange hover:bg-eco-orange-light text-white rounded-xl font-heading font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.2)]"
            >
              <Save size={18} />
              {isSubmitting ? 'Publishing...' : 'Publish Entry'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
