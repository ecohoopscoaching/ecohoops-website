import Hero from '../components/home/Hero'
import Marquee from '../components/home/Marquee'
import PhotoGallery from '../components/home/PhotoGallery'
import Features from '../components/home/Features'
import Pillars from '../components/home/Pillars'
import AllGirlsProgram from '../components/home/AllGirlsProgram'
import Testimonials from '../components/home/Testimonials'
import Nonprofit from '../components/home/Nonprofit'
import InstagramFeed from '../components/home/InstagramFeed'
import CTA from '../components/home/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <PhotoGallery />
      <div className="section-divider" />
      <Features />
      <div className="section-divider" />
      <Pillars />
      <div className="section-divider" />
      <AllGirlsProgram />
      <div className="section-divider" />
      <Testimonials />
      <div className="section-divider" />
      <Nonprofit />
      <div className="section-divider" />
      <InstagramFeed />
      <CTA />
    </>
  )
}
