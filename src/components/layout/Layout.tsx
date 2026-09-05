import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

declare global {
  interface Window {
    fbq?: any
  }
}

export default function Layout() {
  const location = useLocation()
  const isInitialRender = useRef(true)

  useEffect(() => {
    // index.html already fires the initial PageView on page load.
    // Only fire PageView on subsequent client route transitions to prevent duplicate counts.
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [location.pathname])

  const isLandingPage = location.pathname === '/girls-tryouts' || location.pathname === '/girls-grade-5-6'

  return (
    <div className="relative min-h-screen bg-eco-black">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-eco-blue/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-eco-navy-bright/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/2 w-96 h-64 bg-eco-navy-bright/3 rounded-full blur-[128px]" />
      </div>

      {!isLandingPage && <Navbar />}
      <main className="relative z-10">
        <Outlet />
      </main>
      {!isLandingPage && <Footer />}
    </div>
  )
}
