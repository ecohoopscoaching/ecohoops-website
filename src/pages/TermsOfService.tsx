import { motion } from 'framer-motion'
import { useScrollReveal, useMouseGlow } from '../hooks/useScrollReveal'
import { FileText, Scale, ShieldAlert, Award, UserCheck } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function TermsOfService() {
  useDocumentTitle('Terms of Service')
  
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
          <span className="tag mb-4 inline-block">Legal Terms</span>
          <h1 className="font-display text-5xl md:text-7xl uppercase mb-6 leading-[0.9] tracking-[0.04em]">
            <span className="text-white">TERMS OF </span>
            <span className="gradient-text">SERVICE</span>
          </h1>
          <p className="text-xl text-eco-muted-light leading-relaxed">
            Welcome to EcoHoops. By accessing our website or registering for any EcoHoops programs, leagues, camps, or events, you agree to comply with and be bound by the following Terms of Service.
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
          {/* Highlights Card */}
          <div ref={glowRef} className="glow-card p-8 md:p-10 border border-eco-orange/20 bg-eco-orange/5">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-eco-orange h-8 w-8" />
              <h2 className="font-display text-2xl uppercase text-white">Program & Website Terms</h2>
            </div>
            <p className="text-eco-muted-light leading-relaxed text-sm">
              These terms govern all registrations, participation in EcoHoops programs, usage of the EcoHoops digital platform, and obligations of players, parents, and spectators.
            </p>
          </div>

          {/* Section 1: Program Registration & Participation */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-eco-orange mb-2">
              <UserCheck size={22} />
              <h3 className="font-display text-xl uppercase text-white">1. Program Registration & Account Responsibility</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>When creating an account or registering a player for EcoHoops programs:</p>
              <ul className="list-disc pl-6 space-y-2 text-eco-muted-light">
                <li>Registrations for minor participants must be completed by a parent or legal guardian over 18 years of age.</li>
                <li>You agree to provide accurate, current, and complete information during registration.</li>
                <li>You are responsible for maintaining the confidentiality of your account login information.</li>
                <li>EcoHoops reserves the right to accept or decline registrations based on program capacity or eligibility.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Code of Conduct & Safe Environment */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-[#97B3D2] mb-2">
              <Award size={22} />
              <h3 className="font-display text-xl uppercase text-white">2. Code of Conduct & Culture</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>EcoHoops is committed to sportsmanship, respect, and positive youth development:</p>
              <ul className="list-disc pl-6 space-y-2 text-eco-muted-light">
                <li><strong className="text-white">Players & Coaches:</strong> Must treat teammates, opponents, referees, and facility staff with dignity and respect at all times.</li>
                <li><strong className="text-white">Parents & Spectators:</strong> Unsportsmanlike behavior, referee harassment, foul language, or aggressive behavior towards youth or staff will result in immediate removal and potential ban from future events.</li>
                <li><strong className="text-white">Zero Tolerance:</strong> Bullying, discrimination, physical violence, or substance abuse at any EcoHoops facility will result in immediate program dismissal without refund.</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Fees & Payments */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-eco-blue mb-2">
              <FileText size={22} />
              <h3 className="font-display text-xl uppercase text-white">3. Installment Payments, Fees & Refunds</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>
                EcoHoops does not require full season payment upfront. Program fees are divided into flexible installments payable throughout the season.
              </p>
              <p>
                Participants must maintain active installment payments according to the payment schedule agreed upon during registration. Failure to complete scheduled installments may result in temporary suspension from team practices and games.
              </p>
              <p>
                All installment cancellations, program withdrawals, and refunds are governed strictly by our <a href="/refund-policy" className="text-eco-blue hover:underline">Refund & Installment Policy</a>.
              </p>
            </div>
          </div>

          {/* Section 4: Limitation of Liability */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-amber-400 mb-2">
              <ShieldAlert size={22} />
              <h3 className="font-display text-xl uppercase text-white">4. Liability & Medical Authorization</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>
                Basketball involves inherent physical risks. Participation requires a signed EcoHoops <a href="/waiver" className="text-eco-orange hover:underline">Liability Waiver and Release Form</a> prior to taking the court.
              </p>
              <p>
                In the event of an emergency, EcoHoops coaches and staff are authorized to secure necessary medical care for participants if parents/guardians cannot be reached immediately.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
