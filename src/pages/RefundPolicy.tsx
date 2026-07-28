import { motion } from 'framer-motion'
import { useScrollReveal, useMouseGlow } from '../hooks/useScrollReveal'
import { RefreshCw, DollarSign, Calendar, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Link } from 'react-router-dom'

export default function RefundPolicy() {
  useDocumentTitle('Refund Policy')
  
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal(0.05)
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal(0.1)
  const glowRef = useMouseGlow()

  return (
    <div className="pt-28 pb-20 overflow-hidden relative min-h-screen">
      {/* Background ambient glows */}
      <div className="absolute top-12 left-1/4 w-[600px] h-[600px] rounded-full bg-eco-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] rounded-full bg-eco-navy/10 blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 relative z-10">
        <div className="max-w-3xl">
          <span className="tag mb-4 inline-block">Policies</span>
          <h1 className="font-display text-5xl md:text-7xl uppercase mb-6 leading-[0.9] tracking-[0.04em]">
            <span className="text-white">REFUND & </span>
            <span className="gradient-text">CANCELLATION</span>
          </h1>
          <p className="text-xl text-eco-muted-light leading-relaxed">
            As a non-profit sports organization, EcoHoops commits facility rentals, coaching staff, uniforms, and insurance based on advance program registrations. Here is our fair and transparent refund policy.
          </p>
          <p className="text-xs text-eco-muted mt-4">Last Updated: July 2026</p>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto px-6 lg:px-8 mb-16" />

      {/* Policy Content */}
      <section ref={contentRef} className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={contentVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="space-y-12"
        >
          {/* Summary Card */}
          <div ref={glowRef} className="glow-card p-8 md:p-10 border border-eco-blue/20 bg-eco-blue/5">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="text-eco-blue h-8 w-8" />
              <h2 className="font-display text-2xl uppercase text-white">Installment Payments & Withdrawal Terms</h2>
            </div>
            <p className="text-eco-muted-light text-sm mb-6">
              EcoHoops does <strong className="text-white">not</strong> require full season payment upfront. Program fees are divided into flexible installments across the season.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-eco-surface/80 p-4 rounded-xl border border-eco-border">
                <span className="text-emerald-400 font-bold block mb-1">Flexible Installments</span>
                <span className="text-white font-semibold">Pay As You Play</span>
                <p className="text-xs text-eco-muted mt-1">Fees are spread out across scheduled payment dates during the season.</p>
              </div>
              <div className="bg-eco-surface/80 p-4 rounded-xl border border-eco-border">
                <span className="text-amber-400 font-bold block mb-1">14+ Days Before Start</span>
                <span className="text-white font-semibold">Cancel Future Installments</span>
                <p className="text-xs text-eco-muted mt-1">Full deposit refund (less $25 admin fee) & future installments cancelled.</p>
              </div>
              <div className="bg-eco-surface/80 p-4 rounded-xl border border-eco-border">
                <span className="text-eco-blue font-bold block mb-1">During Season Withdrawal</span>
                <span className="text-white font-semibold">Stop Installments</span>
                <p className="text-xs text-eco-muted mt-1">Unprocessed installments are stopped; completed payments pro-rated for medical injuries.</p>
              </div>
            </div>
          </div>

          {/* Section 1: Detailed Withdrawal Terms */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-eco-orange mb-2">
              <Calendar size={22} />
              <h3 className="font-display text-xl uppercase text-white">1. Installment Schedules & Withdrawal Deadlines</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>Refund and cancellation requests must be submitted in writing to <a href="mailto:ecohoopscoaching@gmail.com" className="text-eco-blue hover:underline">ecohoopscoaching@gmail.com</a>.</p>
              <ul className="list-disc pl-6 space-y-2 text-eco-muted-light">
                <li><strong className="text-white">Payment Plans:</strong> Season fees are collected in scheduled installments throughout the program duration. The initial deposit secures your roster spot.</li>
                <li><strong className="text-white">Pre-Season Withdrawal (14+ Days):</strong> Written notice 14+ days before season start cancels all remaining installments and refunds initial deposits, minus a $25 administrative processing fee.</li>
                <li><strong className="text-white">In-Season Withdrawal:</strong> Notice received after the season begins will stop all future unbilled installments. Prior paid installments are non-refundable except for documented medical conditions.</li>
                <li><strong className="text-white">Uniform & Gear Fees:</strong> If customized uniforms or gear have been ordered prior to withdrawal, the actual cost of items will be deducted from any refundable balance.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Medical Exceptions */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
              <CheckCircle2 size={22} />
              <h3 className="font-display text-xl uppercase text-white">2. Medical & Special Considerations</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>
                If a player gets a season-ending injury or illness (with a doctor’s note):
              </p>
              <ul className="list-disc pl-6 space-y-2 text-eco-muted-light">
                <li><strong className="text-white">Future payments stop immediately:</strong> You won't be charged for any remaining installments.</li>
                <li><strong className="text-white">We check what you’ve already paid:</strong> We look at the money collected so far.</li>
                <li><strong className="text-white">We subtract gear costs:</strong> The cost of customized uniforms or gear already ordered is taken out first, since those items can't be returned.</li>
                <li><strong className="text-white">We credit the rest:</strong> Any leftover money from what you paid for games/practices your child has to miss will be given back to you as a program credit.</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Weather & Facility Cancellations */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-amber-400 mb-2">
              <AlertTriangle size={22} />
              <h3 className="font-display text-xl uppercase text-white">3. Inclement Weather & Facility Closure</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>
                If a session is cancelled due to severe weather, facility permit cancellations, or unforeseen safety issues:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-eco-muted-light">
                <li>EcoHoops will make every effort to schedule make-up sessions or extend program dates.</li>
                <li>Monetary refunds are not provided for individual missed make-up dates due to school/gym permit closures beyond our control.</li>
              </ul>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <HelpCircle className="text-eco-blue h-10 w-10 flex-shrink-0" />
              <div>
                <h4 className="font-heading font-bold text-white text-lg">Need Assistance with a Refund?</h4>
                <p className="text-xs text-eco-muted-light">Our administrative team responds within 24-48 hours.</p>
              </div>
            </div>
            <Link to="/contact" className="btn-glow text-xs px-6 py-3 font-bold text-eco-black flex-shrink-0">
              Contact Admin Team
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
