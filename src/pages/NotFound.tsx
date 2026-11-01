import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page Not Found | EcoHoops')

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center mx-auto text-eco-blue font-mono font-bold text-xl">
          404
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-tight">
          Page Not Found
        </h1>
        <p className="text-eco-muted-light text-base leading-relaxed">
          Sorry, we could not find the page you were looking for. It might have been moved or does not exist.
        </p>
        <div>
          <Link
            to="/"
            className="btn-glow inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
