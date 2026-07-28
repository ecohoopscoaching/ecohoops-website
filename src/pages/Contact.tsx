import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Contact() {
  useDocumentTitle('Get in Touch')
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="pt-28 pb-20 min-h-screen bg-eco-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Contact Us</span>
          <h1 className="font-display text-section uppercase tracking-tight mb-6">
            <span className="text-white">GET IN </span>
            <span className="gradient-text">TOUCH.</span>
          </h1>
          <p className="text-eco-muted-light text-lg max-w-2xl mx-auto">
            Have questions about our programs or want to get involved? We're here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glow-card p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-eco-orange/10 border border-eco-orange/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-eco-orange" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg mb-1">Email Us</h3>
                  <p className="text-eco-muted-light mb-2">For general inquiries and support.</p>
                  <a href="mailto:ecohoopscoaching@gmail.com" className="text-eco-orange hover:text-eco-orange/80 transition-colors">ecohoopscoaching@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="glow-card p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-eco-blue-light" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg mb-1">Call Us</h3>
                  <p className="text-eco-muted-light mb-2">Mon-Fri from 9am to 6pm.</p>
                  <a href="tel:+12892338050" className="text-eco-blue-light hover:text-eco-blue transition-colors">289-233-8050</a>
                </div>
              </div>
            </div>

            <div className="glow-card p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg mb-1">Location</h3>
                  <p className="text-eco-muted-light mb-2">Practices held at local schools and community gyms.</p>
                  <p className="text-white">Mississauga, ON, Canada</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="glow-card p-8"
          >
            <h2 className="font-display text-2xl text-white uppercase mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">First Name</label>
                  <input type="text" className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50 transition-colors" placeholder="John" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Last Name</label>
                  <input type="text" className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50 transition-colors" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Email</label>
                <input type="email" className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50 transition-colors" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-eco-muted mb-1">Message</label>
                <textarea rows={4} className="w-full bg-eco-surface border border-eco-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-orange/50 transition-colors resize-none" placeholder="How can we help?"></textarea>
              </div>

              <button type="submit" className="w-full btn-glow flex items-center justify-center gap-2 mt-2">
                <Send size={18} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
