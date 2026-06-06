import Hero from '../components/home/Hero'
import Marquee from '../components/home/Marquee'
import PhotoGallery from '../components/home/PhotoGallery'
import Nonprofit from '../components/home/Nonprofit'
import AllGirlsProgram from '../components/home/AllGirlsProgram'
import JrProgram from '../components/home/JrProgram'
import RepTeams from '../components/home/RepTeams'
import Pillars from '../components/home/Pillars'
import Features from '../components/home/Features'
import Videos from './Videos'
import Podcasts from '../components/home/Podcasts'
import CoachAdrian from '../components/home/CoachAdrian'
import Testimonials from '../components/home/Testimonials'
import InstagramFeed from '../components/home/InstagramFeed'
import CTA from '../components/home/CTA'

export default function Home() {
  return (
    <>
      {/* HERO & INTRO */}
      <Hero />
      <Marquee />

      {/* WHY ECOHOOPS IS DIFFERENT & 6 PILLARS */}
      <Pillars />
      <div className="section-divider" />

      <PhotoGallery />
      <div className="section-divider" />

      {/* SECTION 1-4: PROGRAMS & IMPACT */}
      <Nonprofit />
      <div className="section-divider" />
      <AllGirlsProgram />
      <div className="section-divider" />
      <JrProgram />
      <div className="section-divider" />
      <RepTeams />
      <div className="section-divider" />

      {/* SECTION 5: WHY WE'RE DIFFERENT (FEATURES) */}
      <Features />
      <div className="section-divider" />

      {/* SECTION 5.5: MEDIA & FILMS */}
      <Videos />
      <div className="section-divider" />

      {/* SECTION 5.6: AUDIO & PODCASTS */}
      <Podcasts />
      <div className="section-divider" />

      {/* SECTION 6: FOUNDER & SOCIAL PROOF */}
      <CoachAdrian />
      <div className="section-divider" />
      <Testimonials />
      <div className="section-divider" />

      {/* SECTION 7: COMMUNITY & CTA */}
      <InstagramFeed />
      <CTA />
    </>
  )
}
