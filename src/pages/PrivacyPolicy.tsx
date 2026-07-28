import { motion } from 'framer-motion'
import { useScrollReveal, useMouseGlow } from '../hooks/useScrollReveal'
import { Shield, Lock, Eye, Server, UserCheck, Mail, FileText } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function PrivacyPolicy() {
  useDocumentTitle('Privacy Policy')
  
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
          <span className="tag mb-4 inline-block">Legal & Transparency</span>
          <h1 className="font-display text-5xl md:text-7xl uppercase mb-6 leading-[0.9] tracking-[0.04em]">
            <span className="text-white">PRIVACY </span>
            <span className="gradient-text">POLICY</span>
          </h1>
          <p className="text-xl text-eco-muted-light leading-relaxed">
            EcoHoops for Kids Canada ("EcoHoops", "we", "us", or "our") values your trust. This Privacy Policy explains how we collect, use, disclose, and protect personal information for players, parents, coaches, and website visitors.
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
          <div ref={glowRef} className="glow-card p-8 md:p-10 border border-eco-blue/20 bg-eco-blue/5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-eco-blue h-8 w-8" />
              <h2 className="font-display text-2xl uppercase text-white">Youth Privacy Commitment</h2>
            </div>
            <p className="text-eco-muted-light leading-relaxed text-sm">
              We operate youth basketball programs exclusively in Mississauga, Ontario. The protection of children's and families' personal information is paramount. We adhere to applicable Canadian privacy laws (including PIPEDA) and strict youth protection standards.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-eco-orange mb-2">
              <Eye size={22} />
              <h3 className="font-display text-xl uppercase text-white">1. Information We Collect</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>We collect information necessary to operate our basketball leagues, camps, clinics, and digital platform:</p>
              <ul className="list-disc pl-6 space-y-2 text-eco-muted-light">
                <li><strong className="text-white">Participant & Guardian Information:</strong> Names, birthdates, gender, emergency contact information, home address, phone numbers, and email addresses.</li>
                <li><strong className="text-white">Player Athletic & Health Details:</strong> Medical conditions/allergies (for court safety and emergency response), jersey sizes, skill levels, and team assignments.</li>
                <li><strong className="text-white">Account & Login Credentials:</strong> Email addresses and password hashes when registering on our platform.</li>
                <li><strong className="text-white">Media Content:</strong> Photos and videos recorded during games, training sessions, or EcoHoops events (subject to photo consent).</li>
                <li><strong className="text-white">Technical & Usage Data:</strong> IP address, browser type, device information, and pages visited via analytics.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-[#97B3D2] mb-2">
              <Server size={22} />
              <h3 className="font-display text-xl uppercase text-white">2. How We Use Your Information</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>Your information is used strictly for program operations and athlete support:</p>
              <ul className="list-disc pl-6 space-y-2 text-eco-muted-light">
                <li>Managing registrations, scheduling games, and organizing team rosters.</li>
                <li>Communicating schedule updates, emergency notices, and program announcements.</li>
                <li>Ensuring court safety and medical readiness during practices and games.</li>
                <li>Processing non-profit financial aid applications and subsidies.</li>
                <li>Publishing team stats, highlight clips, and community newsletters (with consent).</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Data Protection & Security */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-eco-blue mb-2">
              <Lock size={22} />
              <h3 className="font-display text-xl uppercase text-white">3. Data Protection & Third Parties</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>
                We do not sell, rent, or trade personal information to third parties. We share information only with trusted service providers necessary for operations (e.g., cloud hosting, registration platforms, payment gateways) under strict confidentiality agreements.
              </p>
              <p>
                We maintain administrative, technical, and physical safeguards to protect your personal data against unauthorized access, loss, or alteration.
              </p>
            </div>
          </div>

          {/* Section 4: Your Rights & Contact */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
              <UserCheck size={22} />
              <h3 className="font-display text-xl uppercase text-white">4. Your Rights & Access</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>
                Parents and legal guardians have the right to access, update, or request the deletion of their child's personal information at any time. You may also update your marketing and photo consent preferences by contacting us.
              </p>
              <div className="pt-4 border-t border-eco-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h4 className="font-heading font-semibold text-white">Have Privacy Questions?</h4>
                  <p className="text-xs text-eco-muted">Reach out to our Privacy Officer at EcoHoops Canada.</p>
                </div>
                <a
                  href="mailto:ecohoopscoaching@gmail.com?subject=Privacy%20Inquiry"
                  className="btn-glow text-xs px-4 py-2 font-bold flex items-center gap-2 text-eco-black"
                >
                  <Mail size={14} /> Contact Privacy Team
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
