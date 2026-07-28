import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { TESTIMONIALS } from '../data/content'
import { ArrowRight, Quote, Heart, Users, Calendar, Trophy, Zap, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function About() {
  useDocumentTitle('Our Story')
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal(0.05)
  const { ref: storyRef, isVisible: storyVisible } = useScrollReveal(0.1)
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollReveal(0.1)
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollReveal(0.1)
  const { ref: orgRef, isVisible: orgVisible } = useScrollReveal(0.1)
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal(0.1)

  const timelineMilestones = [
    {
      year: '2024',
      title: 'EcoHoops Launches',
      desc: 'Coach Adrian founded EcoHoops in Mississauga in late 2024 to save youth sports from toxic pressure. We began with just a few players in local school gyms, prioritizing free play and emotional safety.',
      icon: Zap,
      color: '#6A9BC7'
    },
    {
      year: '2025',
      title: 'Federal Non-Profit Expansion',
      desc: 'In July 2025, we established "EcoHoops for Kids Canada" as a federal non-profit organization to provide extensive financial subsidies, scholarships, and wellness support for families in Mississauga.',
      icon: Users,
      color: '#97B3D2'
    },
    {
      year: '2026',
      title: 'The Movement Today',
      desc: 'Today we support our 2011 Boys and 2012 Girls competitive rep teams alongside developmental training groups. As a young organization, we are actively expanding and seeking coaches (especially female mentors) to grow with us.',
      icon: Trophy,
      color: '#4A7FB5'
    }
  ]

  return (
    <div className="pt-28 pb-20 overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-12 left-1/4 w-[600px] h-[600px] rounded-full bg-eco-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] rounded-full bg-eco-navy/10 blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 relative z-10"
          >
            <span className="tag mb-4 inline-block">The EcoHoops Story</span>
            <h1 className="font-display text-hero uppercase mb-6 leading-[0.9] tracking-[0.04em]">
              <span className="text-white">BUILDING PEOPLE,</span>
              <br />
              <span className="text-white">NOT JUST </span>
              <span className="gradient-text">PROS</span>
            </h1>
            <p className="text-xl text-eco-muted-light leading-relaxed">
              We started EcoHoops to save youth sports from too much pressure and stress. We believe basketball is a great tool to build happy, strong, and confident kids.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative rounded-2xl overflow-hidden h-[300px] lg:h-[400px] z-0"
          >
            <img
              src="/images/IMG_0283.JPG"
              alt="EcoHoops coaching staff and players gathering"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-eco-black/50 via-transparent to-eco-navy/20" />
            <div className="absolute inset-0 rounded-2xl border border-eco-blue/10" />
          </motion.div>
        </div>
      </section>

      {/* Coach Adrian Story Section */}
      <section ref={storyRef} className="max-w-6xl mx-auto px-6 lg:px-8 mb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={storyVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glow-card p-8 md:p-12"
        >
          <div className="border-b border-white/5 pb-8 mb-8">
            <span className="tag mb-3 inline-block">The Founder's Journey</span>
            <h2 className="font-display text-4xl uppercase text-white mb-4">
              COACH ADRIAN'S BACKSTORY
            </h2>
            <p className="text-xl md:text-2xl text-eco-blue leading-relaxed font-heading font-semibold italic max-w-4xl">
              "We kept the grit, the community, and the love for the game — and burned the rest."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Roots Profile column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-square w-full">
                <img
                  src="/images/IMG_0281.JPG"
                  alt="Coach Adrian teaching a player on court"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="p-5 rounded-2xl bg-eco-black/40 border border-white/5 space-y-3">
                <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest text-eco-blue">
                  The Roots: Little Burgundy, Montreal
                </h4>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  Adrian grew up in Little Burgundy, Montreal, in the 1980s and 1990s. It was a tough neighborhood. Adrian found a safe place and learned how to be a good person by playing sports with kind mentors.
                </p>
              </div>
            </div>

            {/* Content narrative column */}
            <div className="lg:col-span-7 space-y-6 text-base text-eco-muted-light leading-relaxed">
              <p>
                <strong>Adrian Sapp</strong> didn't just study basketball; he lived it at the <strong>highest level</strong>. He was one of the top high school players in Montreal, earning <strong>All-Star</strong> honors at Westmount High before moving on to Vanier College's <strong>elite AAA program</strong>. During the legendary 2004-2005 season, Adrian earned All-Star honors while leading Vanier to a <strong>Provincial Championship</strong> and a trip to the Nationals, where he was named a <strong>2nd Team All-Canadian</strong>. When it comes to skill development and understanding the true flow of the game, Adrian brings the <strong>proven execution of a champion</strong>. He knows exactly what it takes to perform under pressure because he has actually done it.
              </p>

              <p>
                But his deep understanding of youth development wasn't just built in a gym. Adrian grew up in <strong>Little Burgundy</strong>, a tough Montreal neighborhood where poverty and crime were daily realities. Raised by a single mother, his childhood was a high-pressure environment, made more difficult by severe <strong>mental health struggles</strong> within his own family. He knows firsthand what it feels like to navigate stress, trauma, and uncertainty as a kid.
              </p>

              <p>
                During those critical teenage years, local sports legends stepped in to guide him, including Olympian <strong>Wayne Yearwood</strong> and former NFL player turned counselor <strong>Alvin Powell</strong>. But it was Montreal basketball icon <strong>Trevor Williams</strong> who left the biggest blueprint. Trevor famously played against Michael Jordan and the 1992 USA Dream Team. Watching Trevor build his summer camps and grow his kids' foundation showed Adrian exactly how a leader can become a <strong>positive pillar in the community</strong>. Trevor didn't just teach basketball; he showed Adrian how to use the game to <strong>protect youth, build character, and give kids a safe place to land</strong>.
              </p>

              <p>
                The crazy part is that Adrian didn't grow up being coached in a rigid system. He never even played organized basketball until he was 13 at the local high school. Instead, he earned his stripes playing <strong>raw streetball</strong>, competing in tough adult men's leagues starting at just 14 years old, and training entirely by himself for hours on the blacktop in the early mornings.
              </p>

              <p>
                Yet, early in his coaching career, Adrian fell right into the <strong>traditional sports trap</strong>. He used heavy pressure, yelling, and the typical grind culture. But he saw the damage it caused. He watched kids <strong>play with fear</strong>, lose their love for the game, and quit sports entirely.
              </p>

              <p>
                Adrian admitted he was wrong, turned his back on that toxic environment, and changed his approach. He founded <strong>ECOHOOPS</strong> to fix a broken youth sports system.
              </p>

              <p>
                Today, Adrian does things differently. He sets up the court so kids can figure things out on their own, the same way he learned on the playground. He does not treat kids like robots. He holds players accountable, but his ultimate goal is to help kids <strong>grow as whole people</strong>, have fun, and fall in love with the game. When you bring your child to ECOHOOPS, you are getting a <strong>real mentor</strong> who has been there, done that, and made it his life mission to keep your kid <strong>happy, safe, and growing</strong>.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Brand History Timeline Section */}
      <section ref={timelineRef} className="max-w-5xl mx-auto px-6 lg:px-8 mb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={timelineVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Our History</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">ECOHOOPS </span>
            <span className="gradient-text">MILESTONES</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4 leading-relaxed">
            From a single play-based community group to a thriving Mississauga basketball organization, look back at the key moments of our journey.
          </p>
        </motion.div>

        {/* Timeline Line & Milestones */}
        <div className="relative border-l border-[#97B3D2]/20 ml-4 md:ml-32 space-y-12">
          {timelineMilestones.map((milestone, idx) => {
            const Icon = milestone.icon
            return (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: -30 }}
                animate={timelineVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Year Badge floating left for desktop */}
                <div className="hidden md:block absolute right-[calc(100%+24px)] top-1 font-display text-4xl text-right text-eco-muted group-hover:text-white transition-colors duration-300">
                  {milestone.year}
                </div>

                {/* Timeline node icon */}
                <div
                  className="absolute left-[-20px] top-1 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--eco-surface)',
                    borderColor: `${milestone.color}50`,
                    boxShadow: `0 0 15px ${milestone.color}20`
                  }}
                >
                  <Icon size={16} style={{ color: milestone.color }} />
                </div>

                {/* Content Card */}
                <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-xl">
                  {/* Year display for mobile */}
                  <span className="md:hidden inline-block text-xs font-mono font-bold uppercase tracking-wider mb-2" style={{ color: milestone.color }}>
                    {milestone.year}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase tracking-wide">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-eco-muted-light leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How EcoHoops Is Organized Section */}
      <section ref={orgRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-28 relative z-10 border-t border-white/5 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={orgVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Our Legal Foundation</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">HOW ECOHOOPS IS </span>
            <span className="gradient-text">ORGANIZED</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4 leading-relaxed">
            EcoHoops has two separate parts. This clean split lets us focus on runs, coaching, and safety while keeping fees affordable and accessible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: EcoHoops Inc. */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={orgVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glow-card p-8 bg-eco-surface border border-eco-border rounded-3xl relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="font-heading font-extrabold text-xl text-white uppercase tracking-wider">EcoHoops Inc.</h3>
                <span className="text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full bg-[#97B3D2]/10 border border-[#97B3D2]/30 text-[#97B3D2] font-bold self-start sm:self-auto">
                  For-Profit Corporation
                </span>
              </div>
              <div className="text-[11px] font-mono text-eco-muted uppercase tracking-wider mb-6">
                Incorporated: September 11, 2024
              </div>
              
              <div className="space-y-4 text-sm text-eco-muted-light leading-relaxed font-body">
                <p>
                  EcoHoops Inc. handles the basketball side of the program.
                </p>
                <p>
                  This includes coaching, skill development, practice design, team structure, program planning, and basketball-related activities.
                </p>
                <p className="border-t border-white/5 pt-4 text-white font-heading font-bold">
                  This is the side that builds and runs the basketball experience.
                </p>
              </div>
            </div>
            {/* Footer indicator */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-eco-muted uppercase tracking-widest font-mono">
              <span>Focus: Basketball activities, coaching, program planning</span>
            </div>
          </motion.div>

          {/* Card 2: EcoHoops for Kids Canada */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={orgVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glow-card p-8 bg-eco-surface border border-eco-border rounded-3xl relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="font-heading font-extrabold text-xl text-white uppercase tracking-wider">EcoHoops for Kids Canada</h3>
                <span className="text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full bg-[#97B3D2]/10 border border-[#97B3D2]/30 text-[#97B3D2] font-bold self-start sm:self-auto">
                  Federal Non-Profit Corporation
                </span>
              </div>
              <div className="text-[11px] font-mono text-eco-muted uppercase tracking-wider mb-6">
                Incorporated: July 31, 2025
              </div>
              
              <div className="space-y-4 text-sm text-eco-muted-light leading-relaxed font-body">
                <p>
                  EcoHoops for Kids Canada helps make basketball more accessible for kids and families.
                </p>
                <p>
                  This includes gym rentals, equipment purchases, financial aid, free community events, wellness support, and safe basketball opportunities for kids.
                </p>
                <p className="border-t border-white/5 pt-4 text-white font-heading font-bold">
                  Its purpose is simple: To help more kids play, grow, and belong.
                </p>
              </div>
            </div>
            {/* Footer indicator */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-eco-muted uppercase tracking-widest font-mono">
              <span>Focus: Access, gym rentals, equipment, subsidies, community events</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Parent Testimonials Grid */}
      <section ref={testimonialsRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={testimonialsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Real Impact</span>
          <h2 className="font-display text-section uppercase">
            <span className="text-white">PARENT </span>
            <span className="gradient-text">TESTIMONIALS</span>
          </h2>
          <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Hear from the parents who have witnessed their children grow, play, and build resilience with us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glow-card p-6 flex flex-col justify-between"
            >
              <div>
                <Quote size={32} className="text-[#97B3D2]/10 mb-4" />
                <p className="text-sm text-eco-muted-light leading-relaxed italic mb-6">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#97B3D2]/10 border border-[#97B3D2]/20 flex items-center justify-center text-[#97B3D2] font-mono text-sm font-semibold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-white uppercase leading-tight">
                    {testimonial.name}
                  </h4>
                  <p className="text-[11px] text-eco-muted uppercase tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={ctaVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="glow-card p-8 md:p-12 relative overflow-hidden"
        >
          {/* Subtle colored ambient drop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#97B3D2]/10 blur-[50px] pointer-events-none rounded-full" />
          
          <Heart size={48} className="text-[#97B3D2]/30 mx-auto mb-6" />
          <h2 className="font-display text-section uppercase text-white mb-4">
            DISCOVER THE SCIENCE & GROW WITH US
          </h2>
          <p className="text-eco-muted-light max-w-xl mx-auto mb-8 leading-relaxed">
            We do not guess how to teach. Read about our methods, like the <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">Constraints-Led Approach</strong> <span className="text-xs text-eco-muted italic">(changing the game rules to help kids learn)</span>, and why play comes first.
            <br /><br />
            <strong>Join our staff:</strong> As a young organization founded in 2024, we are actively looking for passionate coaches—especially female mentors—to grow our team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/philosophy" className="btn-glow inline-flex items-center gap-2 px-8 py-3">
              Explore Our Philosophy <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="px-6 py-3 border border-[#97B3D2]/20 hover:border-[#97B3D2]/50 bg-eco-surface border rounded-xl text-sm font-heading font-semibold text-white uppercase transition-all duration-300">
              Apply to Coach
            </Link>
            <Link to="/blog" className="px-6 py-3 border border-white/10 hover:border-[#97B3D2]/30 bg-eco-surface2/50 rounded-xl text-sm font-heading font-semibold text-white uppercase transition-all duration-300">
              Read the Blog
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
