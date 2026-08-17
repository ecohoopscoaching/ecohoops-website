import { ArrowRight, Sparkles } from 'lucide-react'

export default function AnnouncementBar() {
  const handleScrollToWaitlist = (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById('jr-nba-waitlist')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <aside aria-label="Announcement" className="relative z-[55] w-full bg-gradient-to-r from-[#001c52] via-[#003366] to-[#001c52] border-b border-[#97B3D2]/30 py-2.5 px-4 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs sm:text-sm font-heading">
        <div className="flex items-center gap-2 font-semibold tracking-wide">
          <Sparkles size={14} className="text-[#97B3D2] animate-pulse flex-shrink-0" />
          <span>Jr. NBA/Jr. WNBA is coming to EcoHoops Jr.</span>
        </div>

        <button
          type="button"
          onClick={handleScrollToWaitlist}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#97B3D2] text-[#060A10] font-heading font-bold text-[11px] sm:text-xs uppercase tracking-wider hover:bg-white hover:shadow-[0_0_15px_rgba(151,179,210,0.6)] transition-all cursor-pointer flex-shrink-0"
        >
          <span>Join the Waitlist</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </aside>
  )
}
