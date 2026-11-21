import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { ArrowRight, ExternalLink, CalendarDays, MapPin, DollarSign, Users } from 'lucide-react'
import { JR_NBA_REGISTER_URL } from './JrNbaAnnouncement'

export default function JrProgram() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="relative py-28 overflow-hidden bg-eco-navy/10">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          {/* Official Brand Lockup */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-[#050B14]/80 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 inline-flex items-center gap-4 sm:gap-6 shadow-xl">
              <img
                src="/images/branding/jr-nba-wnba-dark.png"
                alt="Jr. NBA and Jr. WNBA"
                className="h-8 sm:h-10 w-auto object-contain"
              />
              <div className="h-6 w-px bg-white/15" />
              <img
                src="/images/branding/canada-basketball-vertical-red.png"
                alt="Canada Basketball"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm font-heading font-semibold text-[#97B3D2]">
              Officially partnered with Canada Basketball and NBA Canada.
            </p>
          </div>

          <span className="tag inline-block">EcoHoops Jr. - Grades 1 to 6 - Registration Open</span>

          <h2 className="font-display text-section uppercase tracking-tight">
            <span className="text-white">WHERE KIDS FALL IN LOVE </span>
            <span className="gradient-text">WITH BASKETBALL.</span>
          </h2>

          <div className="text-eco-muted-light text-base sm:text-lg leading-relaxed max-w-3xl mx-auto space-y-3">
            <p>
              Jr. NBA and Jr. WNBA for girls and boys in Grades 1 to 6. Five groups total: kids in Grades 1 and 2 play in one co-ed group. Kids in Grades 3 and 4 have a girls group and a boys group. Kids in Grades 5 and 6 have a girls group and a boys group.
            </p>
            <p>
              Girls groups play 10:00 to 11:00 AM. Boys groups play 11:00 AM to 12:00 PM. No tryouts. No cuts.
            </p>
          </div>

          {/* Quick Facts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left pt-2">
            <div className="p-4 rounded-2xl bg-[#0B1322]/90 border border-white/10">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#97B3D2] mb-1">
                <CalendarDays size={14} className="text-eco-blue" />
                <span>Dates</span>
              </div>
              <p className="text-white font-heading font-semibold text-sm">
                Saturdays, Jan 23 to Mar 13, 2027. 8 sessions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B1322]/90 border border-white/10">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#97B3D2] mb-1">
                <MapPin size={14} className="text-eco-blue" />
                <span>Location</span>
              </div>
              <p className="text-white font-heading font-semibold text-sm">
                St. Francis of Assisi School gym, 2480 Thornlodge Dr, Mississauga.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B1322]/90 border border-white/10">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#97B3D2] mb-1">
                <DollarSign size={14} className="text-eco-blue" />
                <span>Price and Gear</span>
              </div>
              <p className="text-white font-heading font-semibold text-sm">
                $249 for all 8 sessions. Reversible Jr. NBA or Jr. WNBA uniform and basketball included.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B1322]/90 border border-white/10">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#97B3D2] mb-1">
                <Users size={14} className="text-eco-blue" />
                <span>Group Size</span>
              </div>
              <p className="text-white font-heading font-semibold text-sm">
                Maximum 15 players per group. First paid, first served.
              </p>
            </div>
          </div>

          {/* Honest Planning Notice */}
          <p className="text-sm text-eco-muted-light max-w-2xl mx-auto p-4 rounded-2xl bg-[#003366]/20 border border-eco-blue/30 leading-relaxed">
            This program is being planned, and registration is open. Only the first two groups that fill will run. If your child's group does not fill, you choose a full refund or holding the spot for a later start.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={JR_NBA_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center justify-center gap-2"
            >
              Register
              <ExternalLink size={16} />
            </a>
            <a
              href="#jr-nba-waitlist"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('jr-nba-waitlist')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-ghost inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              Get Program Updates
            </a>
            <Link
              to="/jr"
              className="btn-ghost inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              Explore EcoHoops Jr.
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
