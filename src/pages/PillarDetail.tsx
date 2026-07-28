import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PILLARS_DETAIL } from '../data/pillars_detail'
import { PILLARS } from '../data/content'
import { 
  Zap, Puzzle, Flame, Brain, Shuffle, TrendingUp, 
  ArrowLeft, BookOpen, GraduationCap, Sparkles, AlertCircle, CheckCircle, ArrowRight
} from 'lucide-react'
import { useEffect } from 'react'

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Puzzle, Flame, Brain, Shuffle, TrendingUp
}

const IMAGE_MAP: Record<string, string> = {
  'ecological-dynamics': '/images/IMG_0349.JPG',
  'constraints-led-approach': '/images/2.png',
  'self-determination-theory': '/images/IMG_0286.JPG',
  'differential-learning': '/images/IMG_0340.JPG',
  'growth-mindset': '/images/IMG_0350.JPG',
  'mental-health': '/images/IMG_0373.JPG',
}

const PILLAR_NUMBERS: Record<string, string> = {
  'ecological-dynamics': '01',
  'constraints-led-approach': '02',
  'self-determination-theory': '03',
  'differential-learning': '04',
  'growth-mindset': '05',
  'mental-health': '06',
}

export default function PillarDetail() {
  const { slug } = useParams<{ slug: string }>()
  
  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const parseHighlights = (text: string) => {
    const parts = text.split('**')
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={index} className="text-eco-blue font-bold tracking-wide uppercase font-heading">
            {part}
          </strong>
        )
      }
      return part
    })
  }

  if (!slug || !PILLARS_DETAIL[slug]) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-eco-dark text-white flex flex-col items-center justify-center px-6">
        <AlertCircle size={48} className="text-eco-orange mb-4" />
        <h1 className="font-display text-4xl uppercase text-white mb-2">Pillar Not Found</h1>
        <p className="text-eco-muted-light mb-8 text-center max-w-md">
          The scientific training pillar you are looking for does not exist or has been moved.
        </p>
        <Link to="/philosophy" className="btn-glow inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Philosophy
        </Link>
      </div>
    )
  }

  const pillar = PILLARS_DETAIL[slug]
  const Icon = ICON_MAP[pillar.icon] || Brain
  const bgImage = IMAGE_MAP[slug] || '/images/IMG_0283.JPG'
  const pillarNum = PILLAR_NUMBERS[slug] || '01'

  // Get other pillars for navigation
  const otherPillars = PILLARS.filter(p => p.slug !== slug)

  return (
    <div className="pt-28 pb-20 min-h-screen bg-eco-dark text-white overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-10 pointer-events-none z-0"
        style={{ background: `radial-gradient(circle, ${pillar.color} 0%, transparent 70%)` }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/philosophy" 
            className="inline-flex items-center gap-2 text-xs text-eco-muted-light hover:text-white transition-all font-heading uppercase font-bold group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Back to Philosophy
          </Link>
          <span className="font-mono text-xs text-eco-muted-light">
            PILLAR {pillarNum} / 06
          </span>
        </div>

        {/* Hero Banner Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Header Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 glow-card p-8 md:p-12 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                  style={{ backgroundColor: `${pillar.color}15`, border: `1px solid ${pillar.color}35` }}
                >
                  <Icon size={28} style={{ color: pillar.color }} />
                </div>
                <div>
                  <span 
                    className="text-xs font-mono uppercase tracking-widest block"
                    style={{ color: pillar.color }}
                  >
                    {pillar.subtitle}
                  </span>
                  <h1 className="font-display text-3xl md:text-5xl uppercase text-white mt-1 leading-tight">
                    {pillar.title}
                  </h1>
                </div>
              </div>
              
              <p className="text-lg text-eco-muted-light leading-relaxed mb-8">
                {pillar.description}
              </p>
            </div>

            {/* Quote block */}
            {pillar.quote && (
              <div 
                className="border-l-4 pl-6 py-2 italic font-heading font-medium text-lg text-white/90"
                style={{ borderLeftColor: pillar.color }}
              >
                "{pillar.quote}"
              </div>
            )}
          </motion.div>

          {/* Large Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[280px] lg:min-h-full"
          >
            <img 
              src={bgImage} 
              alt={pillar.title} 
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-eco-black/70 via-transparent to-eco-navy/20" />
            <div className="absolute inset-0 border border-white/5 rounded-2xl" />
            <span 
              className="absolute bottom-6 right-6 font-display text-8xl leading-none opacity-20 select-none"
              style={{ color: pillar.color }}
            >
              {pillarNum}
            </span>
          </motion.div>
        </section>

        {/* Deep Dive Science & Court Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Scientific Foundation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glow-card p-8 md:p-10 bg-eco-surface border border-eco-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center text-eco-blue-light">
                <GraduationCap size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-eco-muted">THE EVIDENCE-BASE</span>
                <h2 className="font-heading font-bold text-xl uppercase text-white">
                  {pillar.scienceTitle || "Scientific Foundation"}
                </h2>
              </div>
            </div>
             <div className="space-y-4 text-eco-muted-light text-sm md:text-base leading-relaxed">
              {pillar.scienceDetails?.map((paragraph, index) => (
                <p key={index}>{parseHighlights(paragraph)}</p>
              ))}
            </div>
          </motion.div>

          {/* On-Court Application */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glow-card p-8 md:p-10 bg-eco-surface border border-eco-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-eco-orange/10 flex items-center justify-center text-eco-orange">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-eco-muted">THE METHODOLOGY</span>
                <h2 className="font-heading font-bold text-xl uppercase text-white">
                  {pillar.onCourtTitle || "How We Practice It"}
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-eco-muted-light text-sm md:text-base leading-relaxed">
              {pillar.onCourtDetails?.map((paragraph, index) => (
                <p key={index}>{parseHighlights(paragraph)}</p>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Street Translation (Parent Benefit) */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glow-card p-8 md:p-12 bg-eco-surface/50 border border-eco-border mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none"
               style={{ backgroundColor: pillar.color }} />
               
          <div className="max-w-3xl">
            <span className="tag mb-3 inline-block">Street Translation</span>
            <h2 className="font-display text-3xl uppercase text-white mb-6">
              WHAT THIS MEANS FOR YOUR CHILD
            </h2>
            <div className="space-y-4">
              {pillar.parentBenefit?.map((benefit, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${pillar.color}20` }}
                  >
                    <CheckCircle size={14} style={{ color: pillar.color }} />
                  </div>
                  <p className="text-eco-muted-light text-base md:text-lg leading-relaxed">
                    {parseHighlights(benefit)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Bottom Navigation: Browse Other Pillars */}
        <section className="border-t border-white/5 pt-16">
          <div className="text-center lg:text-left mb-8">
            <span className="tag mb-2 inline-block">Explore More</span>
            <h2 className="font-display text-section uppercase">
              THE OTHER <span className="gradient-text">PILLARS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {otherPillars.map((otherPillar) => {
              const OtherIcon = ICON_MAP[otherPillar.icon] || Brain
              return (
                <Link
                  key={otherPillar.slug}
                  to={`/pillar/${otherPillar.slug}`}
                  className="glow-card p-6 flex flex-col justify-between hover:scale-[1.02] hover:bg-eco-surface2/60 transition-all duration-300 group"
                  style={{ '--hover-glow': otherPillar.color } as React.CSSProperties}
                >
                  <div className="mb-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                      style={{ backgroundColor: `${otherPillar.color}15`, border: `1px solid ${otherPillar.color}30` }}
                    >
                      <OtherIcon size={18} style={{ color: otherPillar.color }} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-eco-muted block truncate">
                      {otherPillar.subtitle}
                    </span>
                    <h3 className="font-heading font-bold text-sm uppercase text-white mt-1 group-hover:text-eco-blue transition-colors">
                      {otherPillar.title}
                    </h3>
                  </div>
                  
                  <span className="text-xs font-mono uppercase text-eco-muted-light inline-flex items-center gap-1 group-hover:text-white transition-colors">
                    View Pillar <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
