import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
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

      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
