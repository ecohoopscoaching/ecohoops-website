import { motion } from 'framer-motion'
import { useScrollReveal, useMouseGlow } from '../hooks/useScrollReveal'
import { FileCheck, Shield, Heart, Camera, AlertCircle } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Waiver() {
  useDocumentTitle('Player Waiver & Code of Conduct')
  
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
          <span className="tag mb-4 inline-block">Release & Consent</span>
          <h1 className="font-display text-5xl md:text-7xl uppercase mb-6 leading-[0.9] tracking-[0.04em]">
            <span className="text-white">WAIVER & </span>
            <span className="gradient-text">RELEASE</span>
          </h1>
          <p className="text-xl text-eco-muted-light leading-relaxed">
            Standard participation agreement, release of liability, emergency medical consent, and photo permission for all EcoHoops youth basketball events.
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
              <FileCheck className="text-eco-blue h-8 w-8" />
              <h2 className="font-display text-2xl uppercase text-white">Participation Terms & Safety</h2>
            </div>
            <p className="text-eco-muted-light leading-relaxed text-sm">
              All registered players and their legal guardians acknowledge and accept these terms upon completing program registration or entering an EcoHoops event facility.
            </p>
          </div>

          {/* Section 1: Release of Liability */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-eco-orange mb-2">
              <Shield size={22} />
              <h3 className="font-display text-xl uppercase text-white">1. Release & Hold Harmless Agreement</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p className="bg-eco-black/40 border border-white/5 p-4 rounded-xl text-white/90">
                "I, the undersigned, acknowledge that participation in the EcoHoops program involves physical activities that carry inherent risks, including the risk of injury. I hereby release and hold harmless EcoHoops, its coaches, staff, volunteers, and associated facilities from any and all liability, claims, demands, or causes of action that may arise from my child’s participation in the program, whether caused by negligence or otherwise."
              </p>
            </div>
          </div>

          {/* Section 2: Medical Authorization */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
              <Heart size={22} />
              <h3 className="font-display text-xl uppercase text-white">2. Emergency Medical Authorization</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p className="bg-eco-black/40 border border-white/5 p-4 rounded-xl text-white/90">
                "In the event of a medical emergency, I authorize the staff of EcoHoops to seek medical treatment for my child. I understand that all efforts will be made to contact me or the emergency contact provided in this form before initiating medical treatment. I accept responsibility for any medical expenses that may arise from such treatment."
              </p>
            </div>
          </div>

          {/* Section 3: Assumption of Risk */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-[#97B3D2] mb-2">
              <FileCheck size={22} />
              <h3 className="font-display text-xl uppercase text-white">3. Voluntary Assumption of Risk</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p className="bg-eco-black/40 border border-white/5 p-4 rounded-xl text-white/90">
                "I acknowledge and understand that participation in the EcoHoops program involves potential risks, including but not limited to physical injury, and I voluntarily assume all such risks on behalf of my child."
              </p>
            </div>
          </div>

          {/* Section 4: Photo & Media Consent */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-amber-400 mb-2">
              <Camera size={22} />
              <h3 className="font-display text-xl uppercase text-white">4. Media & Photo Release</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p className="bg-eco-black/40 border border-white/5 p-4 rounded-xl text-white/90">
                "I grant permission for EcoHoops to use photographs or video footage of my child taken during program activities for promotional purposes, including social media, websites, and other marketing materials."
              </p>
            </div>
          </div>

          {/* Section 5: Safe Sport Pledge */}
          <div className="bg-eco-surface/50 border border-eco-border rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-eco-blue mb-2">
              <AlertCircle size={22} />
              <h3 className="font-display text-xl uppercase text-white">5. Safe Sport & Responsible Coaching</h3>
            </div>
            <div className="text-eco-muted-light text-sm space-y-3 leading-relaxed">
              <p>
                EcoHoops strictly enforces Safe Sport guidelines and the Responsible Coaching Movement. For detailed reporting channels and athlete protection policies, please visit our <a href="/safe-sport" className="text-eco-blue hover:underline">Safe Sport & Financial Aid</a> page.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
